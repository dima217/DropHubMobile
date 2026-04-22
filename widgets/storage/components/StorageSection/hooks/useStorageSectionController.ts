import { favoritesApi } from "@/api/favorites";
import { StorageItem } from "@/api/types/storage";
import { createStorageItemMenuItems } from "@/widgets/storageList/menu/storageItemMenu";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  consumePendingMoveFromFavorites,
} from "../../../pendingMoveFromFavorites";
import { StorageSectionModalsState } from "../StorageSectionModals";
import { useStorageSectionBatch } from "./useStorageSectionBatch";
import { useStorageSectionCore } from "./useStorageSectionCore";
import type { StorageSectionProps } from "../types";

export function useStorageSectionController(props: StorageSectionProps) {
  const {
    menuOptions,
    getMenuItems: getMenuItemsProp,
    renderHeaderActions,
    externalData,
    sharedContext,
    archiveMode,
    showAuthorship,
    getItemAuthor,
  } = props;

  const dispatch = useDispatch();
  const core = useStorageSectionCore(props);
  const { options, isFavoritesVirtualRoot, favorites, refetchStructure, storageId } =
    core;

  const effectiveMenuOptions = useMemo(() => {
    if (isFavoritesVirtualRoot && options.menuOptionsAtVirtualRoot) {
      return options.menuOptionsAtVirtualRoot;
    }
    return menuOptions;
  }, [isFavoritesVirtualRoot, options.menuOptionsAtVirtualRoot, menuOptions]);

  const buildBatchBody = useCallback(
    (itemIds: string[]) => ({
      storageId: core.storageId,
      itemIds,
      ...(core.effectiveResourceId ? { resourceId: core.effectiveResourceId } : {}),
    }),
    [core.storageId, core.effectiveResourceId]
  );

  const {
    selectedIds,
    setSelectedIds,
    batchDestination,
    setBatchDestination,
    batchTagsModalVisible,
    setBatchTagsModalVisible,
    batchTagsInput,
    setBatchTagsInput,
    resetMultiSelect,
    toggleSelection,
    confirmBatchDestination,
    handleBatchTagsSubmit,
    multiSelectMenuItems,
    isBatchMoveDestinationInvalid,
    handleNavigateWithBatchGuard,
    handleFolderPressWithBatchGuard,
  } = useStorageSectionBatch({
    storageId: core.storageId,
    navigationParentId: core.navigationParentId,
    options,
    externalData,
    sharedContext,
    favorites: favorites?.items,
    dispatch,
    isFavoritesVirtualRoot,
    navigateTo: core.navigateTo,
    openFolder: core.openFolder,
    refetchStructure,
    buildBatchBody,
  });

  const isMultiSelectMode =
    core.multiSelectEnabled && selectedIds.size > 0 && !batchDestination;
  const isDestinationPick =
    core.multiSelectEnabled && batchDestination !== null;

  useFocusEffect(
    useCallback(() => {
      if (options.consumePendingMoveOnTabFocus !== true || !storageId) {
        return;
      }
      const pending = consumePendingMoveFromFavorites();
      if (!pending) return;
      if (pending.kind === "single") {
        core.setSelectedItem(pending.item);
        core.setMoveModalVisible(true);
      } else {
        setBatchDestination({ kind: "move", itemIds: pending.itemIds });
        setSelectedIds(new Set());
      }
    }, [
      options.consumePendingMoveOnTabFocus,
      storageId,
      core.setSelectedItem,
      core.setMoveModalVisible,
      setBatchDestination,
      setSelectedIds,
    ])
  );

  const getMenuItems = useCallback(
    (item: StorageItem, ctx: { isFavorite: boolean }) => {
      if (getMenuItemsProp) return getMenuItemsProp(item, ctx);
      return createStorageItemMenuItems(
        item,
        ctx,
        {
          onDownload: core.actions.handleDownloadFile,
          onConvert: core.actions.handleConvert,
          onRename: core.actions.handleRename,
          onCopy: core.actions.handleCopy,
          onMove: core.handleMoveItemForMenu,
          onAddToFavorites: core.actions.handleAddToFavorites,
          onRemoveFromFavorites: core.actions.handleRemoveFromFavorites,
          onAddTag: core.actions.handleAddTag,
          onShare:
            sharedContext && !sharedContext.canManagePermissions
              ? undefined
              : core.actions.handleShare,
          onViewPermissions: core.actions.handleViewPermissions,
          onInfo: core.actions.handleInfo,
          onDelete: (storageItem) => {
            void core.actions.handleMoveToTrash(storageItem).then(() => {
              if (options.favoritesBrowseMode) {
                dispatch(favoritesApi.util.invalidateTags(["Favorites"]));
              }
            });
          },
        },
        effectiveMenuOptions
      );
    },
    [
      getMenuItemsProp,
      core.actions,
      effectiveMenuOptions,
      sharedContext,
      core.handleMoveItemForMenu,
      options.favoritesBrowseMode,
      dispatch,
    ]
  );

  const moveIntoSelfBlocked = Boolean(
    core.moveModalVisible &&
      core.selectedItem?.isDirectory &&
      core.navigationParentId !== null &&
      core.navigationParentId === core.selectedItem.id
  );

  const disabledFolderIds = useMemo(() => {
    const merged = new Set<string>();
    if (core.moveModalVisible && core.selectedItem?.isDirectory) {
      merged.add(core.selectedItem.id);
    }
    if (batchDestination?.kind === "move") {
      for (const id of batchDestination.itemIds) merged.add(id);
    }
    if (merged.size === 0) return undefined;
    return merged;
  }, [core.moveModalVisible, core.selectedItem, batchDestination]);

  const modalsState: StorageSectionModalsState = useMemo(
    () => ({
      tagsModalVisible: core.tagsModalVisible,
      globalTagsModalVisible: core.globalTagsModalVisible,
      grantAccessModalVisible: core.grantAccessModalVisible,
      permissionsModalVisible: core.permissionsModalVisible,
      renameModalVisible: core.renameModalVisible,
      infoModalVisible: core.infoModalVisible,
      createFolderModalVisible: core.createFolderModalVisible,
      moveModalVisible: core.moveModalVisible,
      uploadPreviewModalVisible: core.isUploadPreviewModalVisible,
      selectedItem: core.selectedItem,
      archiveRoomModalVisible: core.archiveRoomModalVisible,
    }),
    [
      core.tagsModalVisible,
      core.globalTagsModalVisible,
      core.grantAccessModalVisible,
      core.permissionsModalVisible,
      core.renameModalVisible,
      core.infoModalVisible,
      core.createFolderModalVisible,
      core.moveModalVisible,
      core.isUploadPreviewModalVisible,
      core.selectedItem,
      core.archiveRoomModalVisible,
    ]
  );

  const modalsSetters = useMemo(
    () => ({
      setTagsModalVisible: core.setTagsModalVisible,
      setGlobalTagsModalVisible: core.setGlobalTagsModalVisible,
      setGrantAccessModalVisible: core.setGrantAccessModalVisible,
      setPermissionsModalVisible: core.setPermissionsModalVisible,
      setRenameModalVisible: core.setRenameModalVisible,
      setInfoModalVisible: core.setInfoModalVisible,
      setCreateFolderModalVisible: core.setCreateFolderModalVisible,
      setMoveModalVisible: core.setMoveModalVisible,
      setArchiveRoomModalVisible: core.setArchiveRoomModalVisible,
    }),
    [
      core.setTagsModalVisible,
      core.setGlobalTagsModalVisible,
      core.setGrantAccessModalVisible,
      core.setPermissionsModalVisible,
      core.setRenameModalVisible,
      core.setInfoModalVisible,
      core.setCreateFolderModalVisible,
      core.setMoveModalVisible,
      core.setArchiveRoomModalVisible,
    ]
  );

  const isLoading =
    (!sharedContext && core.isStorageInfoLoading) ||
    (!!storageId && core.isStructureLoading && !externalData);

  return {
    ...core,
    selectedIds,
    batchDestination,
    batchTagsModalVisible,
    batchTagsInput,
    setBatchTagsModalVisible,
    setBatchTagsInput,
    resetMultiSelect,
    toggleSelection,
    confirmBatchDestination,
    handleBatchTagsSubmit,
    multiSelectMenuItems,
    isBatchMoveDestinationInvalid,
    handleNavigateWithBatchGuard,
    handleFolderPressWithBatchGuard,
    isMultiSelectMode,
    isDestinationPick,
    getMenuItems,
    moveIntoSelfBlocked,
    disabledFolderIds,
    modalsState,
    modalsSetters,
    isLoading,
    renderHeaderActions,
    externalData,
    sharedContext,
    archiveMode,
    showAuthorship,
    getItemAuthor,
  };
}

export type StorageSectionViewModel = ReturnType<
  typeof useStorageSectionController
>;
