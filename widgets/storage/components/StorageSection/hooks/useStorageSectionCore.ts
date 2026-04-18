import {
  useCreateStorageFolderMutation,
  useGetFavoritesQuery,
  useGetStorageInfoQuery,
  useGetStorageStructureQuery,
  useRemoveStorageTagsMutation,
} from "@/api";
import { ResourceType } from "@/api/types/shared";
import { StorageItem } from "@/api/types/storage";
import { useFolderPathNavigation } from "@/widgets/storageList/hooks/useFolderPathNavigation";
import { skipToken } from "@reduxjs/toolkit/query";
import { useMemo, useState } from "react";
import { useStorageActions } from "../../../hooks/useStorageActions";
import { useStorageNavigation } from "../../../hooks/useStorageNavigation";
import { useStorageOrSharedUpload } from "../../../hooks/useStorageOrSharedUpload";
import { useStoragePreviewUrls } from "../../../hooks/useStoragePreviewUrls";
import { useStorageSectionItemsPipeline } from "./useStorageSectionItemsPipeline";
import { useStorageSectionScreenHandlersBridge } from "./useStorageSectionScreenHandlersBridge";
import { useStorageSectionFavoritesMoveRedirect } from "./useStorageSectionFavoritesMoveRedirect";
import { useStorageSectionConversionAndArchive } from "./useStorageSectionConversionAndArchive";
import { defaultOptions } from "../data/defaultOptions";
import type { ResolvedStorageSectionOptions, StorageSectionProps } from "../types";

export function useStorageSectionCore(props: StorageSectionProps) {
  const {
    options: optionsProp,
    archiveMode,
    externalData,
    sharedContext,
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
  const [convertItem, setConvertItem] = useState<StorageItem | null>(null);
  const [convertSubmitting, setConvertSubmitting] = useState(false);

  const multiSelectEnabled = options.enableMultiSelect !== false && !archiveMode;

  const {
    data: storageInfo,
    isLoading: isStorageInfoLoading,
    isError: isStorageInfoError,
  } = useGetStorageInfoQuery(undefined, { skip: !!sharedContext });

  const storageId = sharedContext?.storageId ?? storageInfo?.id ?? "";

  const storageTags = useMemo(
    () => storageInfo?.tags ?? [],
    [storageInfo?.tags]
  );

  const {
    currentParentId,
    setCurrentParentId,
    path,
    setPath,
    openFolder,
    navigateTo,
  } = useFolderPathNavigation(options.rootLabel ?? "Root");

  const isAtLogicalRoot = currentParentId === null;

  const isFavoritesVirtualRoot = Boolean(
    options.favoritesBrowseMode && options.initialItems && isAtLogicalRoot
  );

  const navigationParentId =
    externalData?.currentParentId !== undefined
      ? externalData.currentParentId
      : currentParentId;

  const mutationParentId =
    externalData?.effectiveParentId !== undefined
      ? externalData.effectiveParentId
      : navigationParentId;

  const {
    data: structure,
    isLoading: isStructureLoading,
    refetch: refetchStructureQuery,
    isError: isStructureError,
  } = useGetStorageStructureQuery(
    storageId && !externalData
      ? options.initialItems && isAtLogicalRoot
        ? skipToken
        : { storageId, parentId: currentParentId ?? undefined }
      : skipToken
  );

  const refetchStructure = sharedContext?.refetchStructure ?? (() => void refetchStructureQuery());

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
    if (options.favoritesBrowseMode) {
      return new Set(favorites.items.map((fav) => fav.id));
    }
    const frt = sharedContext ? ResourceType.SHARED : ResourceType.STORAGE;
    return new Set(
      favorites.items
        .filter((fav) => fav.resourceType === frt)
        .map((fav) => fav.id)
    );
  }, [favorites, sharedContext, options.favoritesBrowseMode]);

  const [createFolder, { isLoading: isCreatingFolder }] =
    useCreateStorageFolderMutation();
  const [removeStorageTags] = useRemoveStorageTagsMutation();

  const {
    storageConversionOptions,
    handleStorageConvertSelect,
    handleConfirmArchiveRoom,
    isArchivingRoom,
  } = useStorageSectionConversionAndArchive({
    storageId,
    navigationParentId,
    sharedContext,
    archiveMode,
    convertItem,
    setConvertItem,
    setConvertSubmitting,
  });

  const itemPipeline = useStorageSectionItemsPipeline({
    structure,
    navigationParentId,
    isAtLogicalRoot,
    initialItems: options.initialItems,
    externalData,
    storageTags,
    selectedItem,
  });

  const {
    itemsInCurrentFolder,
    globalTags,
    itemTags,
    selectedItemState,
    removeGlobalTag,
    addItemTag,
    removeItemTag,
    currentFolderFileNames,
  } = itemPipeline;

  const {
    uploadingFiles,
    isUploadPreviewModalVisible,
    pickFiles,
    uploadFiles,
    clearUploads,
  } = useStorageOrSharedUpload({
    variant: sharedContext ? "shared" : "storage",
    storageId,
    storageParentId: mutationParentId || undefined,
    sharedResourceId: sharedContext?.resourceId ?? "",
    sharedParentId:
      mutationParentId === null || mutationParentId === undefined
        ? ""
        : String(mutationParentId),
    existingFileNames: currentFolderFileNames,
  });

  const actions = useStorageActions({
    storageId,
    currentParentId: mutationParentId,
    resourceId: sharedContext?.resourceId,
    resourceType: sharedContext ? ResourceType.SHARED : undefined,
    refetchStructure,
    onConvertRequest: setConvertItem,
    setSelectedItem,
    setTagsModalVisible,
    setGrantAccessModalVisible,
    setPermissionsModalVisible,
    setRenameModalVisible,
    setInfoModalVisible,
    setMoveModalVisible,
    setCreateFolderModalVisible,
  });

  const handleMoveItemForMenu = useStorageSectionFavoritesMoveRedirect({
    isFavoritesVirtualRoot,
    options,
    actions,
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
    handleGrantAccess,
    handleAddItemTag,
    handleRemoveItemTag,
  } = useStorageSectionScreenHandlersBridge(
    {
      storageId,
      mutationParentId,
      createFolder,
      removeStorageTags,
      refetchStructure,
      selectedItemState,
      actions,
      createFolderResourceId: sharedContext?.resourceId,
      addItemTag,
      removeItemTag,
    }
  );

  return {
    options,
    multiSelectEnabled,
    previewEnabled,
    setPreviewEnabled,
    tagsModalVisible,
    setTagsModalVisible,
    globalTagsModalVisible,
    setGlobalTagsModalVisible,
    grantAccessModalVisible,
    setGrantAccessModalVisible,
    permissionsModalVisible,
    setPermissionsModalVisible,
    renameModalVisible,
    setRenameModalVisible,
    infoModalVisible,
    setInfoModalVisible,
    createFolderModalVisible,
    setCreateFolderModalVisible,
    moveModalVisible,
    setMoveModalVisible,
    archiveRoomModalVisible,
    setArchiveRoomModalVisible,
    selectedItem,
    setSelectedItem,
    convertItem,
    setConvertItem,
    convertSubmitting,
    storageInfo,
    isStorageInfoLoading,
    isStorageInfoError,
    storageId,
    storageTags,
    path,
    openFolder,
    navigateTo,
    isFavoritesVirtualRoot,
    navigationParentId,
    mutationParentId,
    isStructureLoading,
    isStructureError,
    refetchStructure,
    favorites,
    favoriteItemIds,
    createFolder,
    isCreatingFolder,
    isArchivingRoom,
    storageConversionOptions,
    handleStorageConvertSelect,
    handleConfirmArchiveRoom,
    itemsInCurrentFolder,
    globalTags,
    itemTags,
    uploadingFiles,
    isUploadPreviewModalVisible,
    pickFiles,
    uploadFiles,
    clearUploads,
    actions,
    handleMoveItemForMenu,
    previewUrls,
    handleCreateFolder,
    handleRemoveGlobalTag,
    handleConfirmRename,
    handleConfirmMove,
    handleGrantAccess,
    handleAddItemTag,
    handleRemoveItemTag,
    currentFolderFileNames,
  };
}
