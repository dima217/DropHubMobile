import {
  useCreateStorageFolderMutation,
  useGetFavoritesQuery,
  useGetStorageInfoQuery,
  useGetStorageStructureQuery,
  useRemoveStorageTagsMutation,
} from "@/api";
import { useArchiveRoomToStorageMutation } from "@/api/storageApi";
import { ResourceType } from "@/api/types/shared";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import PreviewToggleSwitch from "@/shared/ui/PreviewToggleSwitch";
import { useFolderPathNavigation } from "@/widgets/storageList/hooks/useFolderPathNavigation";
import {
  createStorageItemMenuItems,
  StorageItemMenuOptions,
} from "@/widgets/storageList/menu/storageItemMenu";
import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  View as RNView,
  StyleSheet,
  View
} from "react-native";
import { useStorageActions } from "../../hooks/useStorageActions";
import { useStorageFileUpload } from "../../hooks/useStorageFileUpload";
import { useStorageNavigation } from "../../hooks/useStorageNavigation";
import { useStoragePreviewUrls } from "../../hooks/useStoragePreviewUrls";
import { useStorageScreenHandlers } from "../../hooks/useStorageScreenHandlers";
import { useSelectedItemState } from "../../hooks/useTagsState";
import { StorageBreadcrumbs } from "../Path";
import { StorageFAB } from "../StorageFAB";
import { StorageItemList } from "../StorageItemList";
import {
  StorageSectionModals,
  StorageSectionModalsState,
} from "./StorageSectionModals";
import { defaultOptions } from "./data/defaultOptions";

/**
 * Display and behaviour options for the storage section.
 * All fields are optional; missing values fall back to defaults from `defaultOptions`.
 */
export interface StorageSectionOptions {
  /** Whether to show breadcrumb navigation and folder path */
  showBreadcrumbs?: boolean;
  /** Whether to show the preview thumbnails toggle */
  showPreviewToggle?: boolean;
  /** Whether to show the FAB (create folder / upload files) */
  showFAB?: boolean;
  /** Whether to show the global tags button in the header (use with `renderHeaderActions`) */
  showGlobalTagsButton?: boolean;
  /** Target parent folder id for initial navigation (e.g. when opening from favorites) */
  targetParentId?: string;
  /**
   * Custom label for the logical root in breadcrumbs.
   * Defaults to "Root" when not provided.
   */
  rootLabel?: string;
  /**
   * Optional initial set of items that will be shown when the user
   * is at the logical root (i.e. before navigating into any folder).
   *
   * This is used to support "virtual roots" such as search results,
   * favorites, etc. When provided and the current parent is `null`,
   * these items are rendered instead of fetching the real root
   * contents from the storage structure API.
   */
  initialItems?: StorageItem[];
}

/**
 * Resolved options with all boolean flags required.
 * Used internally after merging `defaultOptions` with parent-provided options.
 */
export type ResolvedStorageSectionOptions = StorageSectionOptions & {
  showBreadcrumbs: boolean;
  showPreviewToggle: boolean;
  showFAB: boolean;
  showGlobalTagsButton: boolean;
};

/**
 * Props for the StorageSection component.
 * The parent is responsible for providing menu options and optional overrides.
 */
export interface StorageSectionProps {
  /** Section display/behaviour options. Defaults are used when not provided. */
  options?: StorageSectionOptions;
  /** Menu options for folders and files. Must be provided by the parent. */
  menuOptions: StorageItemMenuOptions;
  /**
   * Custom menu builder. When provided, used instead of
   * `createStorageItemMenuItems(item, ctx, handlers, menuOptions)`.
   */
  getMenuItems?: (
    item: StorageItem,
    ctx: { isFavorite: boolean }
  ) => ActionMenuItemData[];
  /** Extra content in the header (e.g. tags button, search). Receives `onOpenGlobalTags`. */
  renderHeaderActions?: (params: {
    onOpenGlobalTags: () => void;
  }) => React.ReactNode;
  /** When set, user is choosing a folder to archive a room into; show bottom bar and call API on confirm */
  archiveMode?: {
    roomId: string;
    fileIds: string[];
    onCancel: () => void;
    onComplete: () => void;
  };
  /**
   * Optional external data source for items and navigation.
   * When provided, `StorageSection` will use these items and path
   * instead of computing them from `useGetStorageStructureQuery`.
   * This is useful for shared views or other virtual structures where
   * the list of items is managed by the parent component.
   */
  externalData?: {
    items: StorageItem[];
    path: { id: string | null; name: string }[];
    onFolderPress: (folder: StorageItem) => void;
    onNavigate: (segmentId: string | null, index: number) => void;
  };
  /**
   * Optional authorship rendering for items.
   * When provided, authorship data is passed down to cards.
   */
  showAuthorship?: boolean;
  getItemAuthor?: (item: StorageItem) => {
    avatarUrl?: string;
    firstName?: string;
    userId?: number;
  } | null;
}

/**
 * Universal storage section component that manages storage data, navigation,
 * modals, and item actions. Use wherever you need a self-contained storage
 * browser (main storage tab, shared storage view, etc.).
 *
 * - Fetches storage info, structure, and favorites via API hooks
 * - Manages modal state (rename, move, tags, permissions, etc.) via StorageSectionModals
 * - Supports optional breadcrumbs, preview toggle, FAB, and header actions
 * - Parent must pass `menuOptions`; optional `getMenuItems` overrides default menu building
 */
export const StorageSection: React.FC<StorageSectionProps> = (props) => {
  const {
    options: optionsProp,
    menuOptions,
    getMenuItems: getMenuItemsProp,
    renderHeaderActions,
    archiveMode,
    externalData,
    showAuthorship,
    getItemAuthor,
  } = props;
  const options = useMemo(
    (): ResolvedStorageSectionOptions => ({ ...defaultOptions, ...optionsProp }),
    [optionsProp]
  );

  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [tagsModalVisible, setTagsModalVisible] = useState(false);
  const [globalTagsModalVisible, setGlobalTagsModalVisible] = useState(false);
  const [grantAccessModalVisible, setGrantAccessModalVisible] = useState(false);
  const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [createFolderModalVisible, setCreateFolderModalVisible] = useState(false);
  const [moveModalVisible, setMoveModalVisible] = useState(false);
  const [archiveRoomModalVisible, setArchiveRoomModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);

  const {
    data: storageInfo,
    isLoading: isStorageInfoLoading,
    isError: isStorageInfoError,
  } = useGetStorageInfoQuery();

  const storageId = storageInfo?.id || "";

  const {
    currentParentId,
    setCurrentParentId,
    path,
    setPath,
    openFolder,
    navigateTo,
  } = useFolderPathNavigation(options.rootLabel ?? "Root");

  const isAtLogicalRoot = currentParentId === null;

  const {
    data: structure,
    isLoading: isStructureLoading,
    refetch: refetchStructure,
    isError: isStructureError,
  } = useGetStorageStructureQuery(
    storageId
      ? // When `initialItems` are provided and we are at the logical root,
        // we treat them as a "virtual root" and do not request the real
        // root contents from the API.
        options.initialItems && isAtLogicalRoot
        ? skipToken
        : { storageId, parentId: currentParentId ?? undefined }
      : skipToken
  );

  useStorageNavigation({
    targetParentId: options.targetParentId,
    structure: structure ?? undefined,
    setCurrentParentId,
    setPath,
  });

  const { data: favorites } = useGetFavoritesQuery(undefined, {
    skip: !storageId,
  });

  const favoriteItemIds = useMemo(() => {
    if (!favorites?.items) return new Set<string>();
    return new Set(
      favorites.items
        .filter((fav) => fav.resourceType === ResourceType.STORAGE)
        .map((fav) => fav.id)
    );
  }, [favorites]);

  const [createFolder, { isLoading: isCreatingFolder }] =
    useCreateStorageFolderMutation();
  const [removeStorageTags] = useRemoveStorageTagsMutation();
  const [archiveRoomToStorage, { isLoading: isArchivingRoom }] =
    useArchiveRoomToStorageMutation();

  const handleConfirmArchiveRoom = useCallback(async () => {
    if (!archiveMode || !storageId) return;
    try {
      await archiveRoomToStorage({
        storageId,
        roomId: archiveMode.roomId,
        fileIds: archiveMode.fileIds,
        parentId: currentParentId ?? undefined,
      }).unwrap();
      archiveMode.onComplete();
    } catch (e) {
      console.error("Archive room to storage failed:", e);
    }
  }, [archiveMode, storageId, currentParentId, archiveRoomToStorage]);

  const itemsInCurrentFolderRaw: StorageItem[] = useMemo(() => {
    // When external data is provided, completely delegate visible items
    // to the parent component.
    if (externalData) {
      return externalData.items
        .filter((item) => !item.deletedAt)
        .sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
    }

    // When `initialItems` are passed and we are at the logical root,
    // use them as the visible contents instead of structure-based root.
    if (options.initialItems && isAtLogicalRoot) {
      return options.initialItems
        .filter((item) => !item.deletedAt)
        .sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
    }

    if (!structure) return [];
    return structure
      .filter((item) => item.parentId === currentParentId && !item.deletedAt)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [structure, currentParentId, options.initialItems, isAtLogicalRoot, externalData]);

  const currentFolderItemIds = useMemo(
    () => new Set(itemsInCurrentFolderRaw.map((i) => i.id)),
    [itemsInCurrentFolderRaw]
  );

  const {
    globalTags,
    itemTags,
    selectedItemState,
    removeGlobalTag,
    addItemTag,
    removeItemTag,
    getItemTags,
  } = useSelectedItemState({
    storageTags: storageInfo?.tags || [],
    selectedItemFromProps: selectedItem,
    currentFolderItemIds,
  });

  const itemsInCurrentFolder: StorageItem[] = useMemo(() => {
    return itemsInCurrentFolderRaw.map((item) => ({
      ...item,
      tags: getItemTags(item.id, item.tags || []),
    }));
  }, [itemsInCurrentFolderRaw, getItemTags]);

  const {
    uploadingFiles,
    isUploadPreviewModalVisible,
    pickFiles,
    uploadFiles,
    clearUploads,
  } = useStorageFileUpload(storageId, currentParentId || undefined, undefined);

  const actions = useStorageActions({
    storageId,
    currentParentId,
    refetchStructure,
    setSelectedItem,
    setTagsModalVisible,
    setGrantAccessModalVisible,
    setPermissionsModalVisible,
    setRenameModalVisible,
    setInfoModalVisible,
    setMoveModalVisible,
    setCreateFolderModalVisible,
  });

  const previewUrls = useStoragePreviewUrls(
    storageId,
    itemsInCurrentFolder,
    previewEnabled
  );

  const {
    handleCreateFolder,
    handleRemoveGlobalTag,
    handleConfirmRename,
    handleConfirmMove,
    handleAddItemTag: handleAddItemTagApi,
    handleRemoveItemTag: handleRemoveItemTagApi,
    handleGrantAccess,
  } = useStorageScreenHandlers({
    storageId,
    currentParentId,
    createFolder: (args: { storageId: string; name: string; parentId?: string; isDirectory: boolean }) =>
      createFolder(args).unwrap(),
    removeStorageTags: (args: { storageId: string; tags: string[] }) =>
      removeStorageTags(args).unwrap(),
    refetchStructure,
    selectedItem: selectedItemState,
    actions,
  });

  const handleAddItemTag = useCallback(
    (tag: string) => {
      addItemTag(tag);
      handleAddItemTagApi(tag);
    },
    [addItemTag, handleAddItemTagApi]
  );

  const handleRemoveItemTag = useCallback(
    (tag: string) => {
      removeItemTag(tag);
      handleRemoveItemTagApi(tag);
    },
    [removeItemTag, handleRemoveItemTagApi]
  );

  const getMenuItems = useCallback(
    (item: StorageItem, ctx: { isFavorite: boolean }) => {
      if (getMenuItemsProp) return getMenuItemsProp(item, ctx);
      return createStorageItemMenuItems(
        item,
        ctx,
        {
          onDownload: actions.handleDownloadFile,
          onRename: actions.handleRename,
          onCopy: actions.handleCopy,
          onMove: actions.handleMove,
          onAddToFavorites: actions.handleAddToFavorites,
          onRemoveFromFavorites: actions.handleRemoveFromFavorites,
          onAddTag: actions.handleAddTag,
          onShare: actions.handleShare,
          onViewPermissions: actions.handleViewPermissions,
          onInfo: actions.handleInfo,
          onDelete: actions.handleMoveToTrash,
        },
        menuOptions
      );
    },
    [getMenuItemsProp, actions, menuOptions]
  );

  const disabledFolderIds = useMemo(() => {
    if (!moveModalVisible || !selectedItem || !selectedItem.isDirectory) {
      return undefined;
    }
    return new Set<string>([selectedItem.id]);
  }, [moveModalVisible, selectedItem]);

  const modalsState: StorageSectionModalsState = useMemo(
    () => ({
      tagsModalVisible,
      globalTagsModalVisible,
      grantAccessModalVisible,
      permissionsModalVisible,
      renameModalVisible,
      infoModalVisible,
      createFolderModalVisible,
      moveModalVisible,
      uploadPreviewModalVisible: isUploadPreviewModalVisible,
      selectedItem,
      archiveRoomModalVisible,
    }),
    [
      tagsModalVisible,
      globalTagsModalVisible,
      grantAccessModalVisible,
      permissionsModalVisible,
      renameModalVisible,
      infoModalVisible,
      createFolderModalVisible,
      moveModalVisible,
      isUploadPreviewModalVisible,
      selectedItem,
      archiveRoomModalVisible,
    ]
  );

  const modalsSetters = useMemo(
    () => ({
      setTagsModalVisible,
      setGlobalTagsModalVisible,
      setGrantAccessModalVisible,
      setPermissionsModalVisible,
      setRenameModalVisible,
      setInfoModalVisible,
      setCreateFolderModalVisible,
      setMoveModalVisible,
      setArchiveRoomModalVisible,
    }),
    []
  );

  const isLoading = isStorageInfoLoading || (!!storageId && isStructureLoading);

  if (isStorageInfoError || isStructureError) {
    return (
      <RNView style={styles.center}>
        <RNView style={styles.errorContainer}>
          {/* Текст ошибки можно вынести в options или i18n */}
        </RNView>
      </RNView>
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      )}

      {!isLoading && (
        <>
          <View style={styles.headerRow}>
            {options.showBreadcrumbs && (
              <StorageBreadcrumbs
                path={externalData?.path ?? path}
                onNavigate={(segmentId, index) =>
                  (externalData?.onNavigate ?? navigateTo)(segmentId, index)
                }
              />
            )}
            {options.showPreviewToggle && (
              <PreviewToggleSwitch
                isEnabled={previewEnabled}
                onToggle={setPreviewEnabled}
              />
            )}
            {options.showGlobalTagsButton && renderHeaderActions?.({
              onOpenGlobalTags: () => setGlobalTagsModalVisible(true),
            })}
          </View>

          <StorageItemList
            items={itemsInCurrentFolder}
            previewEnabled={previewEnabled}
            favoriteItemIds={favoriteItemIds}
            previewUrls={previewUrls}
            disabledFolderIds={disabledFolderIds}
            onFolderPress={externalData?.onFolderPress ?? openFolder}
            getMenuItems={getMenuItems}
            showAuthorship={showAuthorship}
            getItemAuthor={getItemAuthor}
          />
        </>
      )}

      {options.showFAB && (
        <StorageFAB
          onCreateFolder={() => setCreateFolderModalVisible(true)}
          onUploadFiles={pickFiles}
          isCreatingFolder={isCreatingFolder}
          isStorageReady={!!storageId}
        />
      )}

      <StorageSectionModals
        state={modalsState}
        setSelectedItem={setSelectedItem}
        setters={modalsSetters}
        storageId={storageId}
        currentParentId={currentParentId}
        storageTags={storageInfo?.tags || []}
        itemTags={itemTags}
        globalTags={globalTags}
        handlers={{
          handleCreateFolder,
          handleConfirmRename,
          handleConfirmMove,
          handleAddItemTag,
          handleRemoveItemTag,
          handleRemoveGlobalTag,
          handleGrantAccess,
          handleConfirmArchiveRoom,
        }}
        archiveMode={archiveMode ? { onCancel: archiveMode.onCancel } : undefined}
        archiveModeDescription={
          archiveMode
            ? "Выберите папку в хранилище, затем нажмите «Архивировать»."
            : undefined
        }
        isArchivingRoom={isArchivingRoom}
        upload={{
          uploadingFiles,
          isUploadPreviewModalVisible,
          clearUploads,
          uploadFiles: async (files) => {
            await uploadFiles(files);
          },
          refetchStructure,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 10,
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
});
