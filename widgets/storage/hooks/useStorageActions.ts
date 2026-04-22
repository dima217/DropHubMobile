import {
  favoritesApi,
  useAddFavoriteFromSharedMutation,
  useAddFavoriteFromStorageMutation,
  useRemoveFavoriteFromSharedMutation,
  useRemoveFavoriteFromStorageMutation,
} from "@/api/favorites";
import {
  useLazyDownloadSharedFileQuery,
  useLazyDownloadStorageFileQuery,
} from "@/api/fileApi";
import { sharedApi, useGrantPermissionsMutation } from "@/api/sharedApi";
import {
  storageApi,
  useCopyStorageItemMutation,
  useMoveStorageItemMutation,
  useMoveStorageItemToTrashMutation,
  useUpdateStorageItemMutation,
  useUpdateStorageItemTagsMutation,
} from "@/api/storageApi";
import { AccessRole } from "@/api/types/room";
import { ResourceType } from "@/api/types/shared";
import { StorageItem } from "@/api/types/storage";
import { useI18n } from "@/shared/localization";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import type { AppDispatch } from "@/store/store";
import {
  getStorageQuotaAlertMessage,
  isStorageQuotaExceededError,
} from "@/widgets/storage/utils/storageQuota";
import { useCallback } from "react";
import { Alert } from "react-native";
import { useDispatch } from "react-redux";

interface UseStorageActionsProps {
  storageId: string;
  currentParentId: string | null;
  resourceId?: string;
  resourceType?: ResourceType;
  refetchStructure: () => void;
  /** Открыть сценарий конвертации файла (модалка на уровне экрана). */
  onConvertRequest?: (item: StorageItem) => void;
  setSelectedItem: (item: StorageItem | null) => void;
  setTagsModalVisible: (visible: boolean) => void;
  setGrantAccessModalVisible: (visible: boolean) => void;
  setPermissionsModalVisible: (visible: boolean) => void;
  setRenameModalVisible: (visible: boolean) => void;
  setInfoModalVisible: (visible: boolean) => void;
  setMoveModalVisible: (visible: boolean) => void;
  setCreateFolderModalVisible?: (visible: boolean) => void;
}

export const useStorageActions = ({
  storageId,
  currentParentId,
  resourceId,
  resourceType,
  refetchStructure,
  onConvertRequest,
  setSelectedItem,
  setTagsModalVisible,
  setGrantAccessModalVisible,
  setPermissionsModalVisible,
  setRenameModalVisible,
  setInfoModalVisible,
  setMoveModalVisible,
}: UseStorageActionsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useI18n();
  const effectiveResourceType = resourceType ?? ResourceType.STORAGE;
  const [updateItem] = useUpdateStorageItemMutation();
  const [copyItem] = useCopyStorageItemMutation();
  const [moveItem] = useMoveStorageItemMutation();
  const [updateItemTags] = useUpdateStorageItemTagsMutation();
  const [moveToTrash] = useMoveStorageItemToTrashMutation();
  const [addFavorite] = useAddFavoriteFromStorageMutation();
  const [addFavoriteFromShared] = useAddFavoriteFromSharedMutation();
  const [removeFavorite] = useRemoveFavoriteFromStorageMutation();
  const [removeFavoriteFromShared] = useRemoveFavoriteFromSharedMutation();
  const [grantPermissions] = useGrantPermissionsMutation();
  const [downloadStorageFile] = useLazyDownloadStorageFileQuery();
  const [downloadSharedFile] = useLazyDownloadSharedFileQuery();

  const incrementDownloadCountInCachedLists = useCallback(
    (itemId: string) => {
      const bump = (list: StorageItem[]) => {
        const hit = list.find((row) => row.id === itemId);
        if (!hit || hit.isDirectory) return;
        const next = (hit.downloadCount ?? hit.fileMeta?.downloadCount ?? 0) + 1;
        hit.downloadCount = next;
        if (hit.fileMeta) {
          hit.fileMeta.downloadCount = next;
        }
      };

      dispatch(
        storageApi.util.updateQueryData(
          "getStorageStructure",
          {
            storageId,
            ...(resourceId ? { resourceId } : {}),
            parentId: currentParentId ?? undefined,
          },
          bump
        )
      );

      if (resourceId) {
        dispatch(
          sharedApi.util.updateQueryData(
            "getSharedStructure",
            { storageId, resourceId, parentId: currentParentId ?? undefined },
            bump
          )
        );
        dispatch(
          sharedApi.util.updateQueryData(
            "getSharedResources",
            undefined,
            bump as unknown as (draft: unknown) => void
          )
        );
      }

      dispatch(
        favoritesApi.util.updateQueryData("getFavorites", undefined, (draft) => {
          bump(draft.items as unknown as StorageItem[]);
        })
      );
    },
    [dispatch, storageId, resourceId, currentParentId]
  );

  const handleDownloadFile = useCallback(
    async (item: StorageItem) => {
      if (!storageId || !item.fileId) return;
      try {
        const response =
          effectiveResourceType === ResourceType.SHARED && resourceId
            ? await downloadSharedFile({
                resourceId,
                fileIds: [item.fileId],
              }).unwrap()
            : await downloadStorageFile({
                storageId,
                fileIds: [item.fileId],
              }).unwrap();
        const uploader = createUploader(UploadProvider.MINIO);
        for (const { url } of response) {
          await uploader.download(url);
        }
        incrementDownloadCountInCachedLists(item.id);
        Alert.alert(t("common.success"), t("storage.download.success"));
      } catch {
        Alert.alert(t("common.error"), t("storage.download.failed"));
      }
    },
    [
      storageId,
      effectiveResourceType,
      resourceId,
      downloadSharedFile,
      downloadStorageFile,
      incrementDownloadCountInCachedLists,
      t,
    ]
  );

  const handleConvert = useCallback(
    (item: StorageItem) => {
      onConvertRequest?.(item);
    },
    [onConvertRequest]
  );

  const handleRename = useCallback(
    (item: StorageItem) => {
      setSelectedItem(item);
      setRenameModalVisible(true);
    },
    [setSelectedItem, setRenameModalVisible]
  );

  const handleConfirmRename = useCallback(
    async (newName: string, selectedItem: StorageItem | null) => {
      if (!selectedItem || !storageId) return;
      try {
        await updateItem({
          storageId,
          resourceId,
          itemId: selectedItem.id,
          newName,
        }).unwrap();
        refetchStructure();
        setSelectedItem(null);
      } catch {
        Alert.alert("Ошибка", "Не удалось переименовать");
      }
    },
    [storageId, resourceId, updateItem, refetchStructure, setSelectedItem]
  );

  const handleCopy = useCallback(
    async (item: StorageItem) => {
      if (!storageId) return;
      try {
        await copyItem({
          storageId,
          resourceId,
          itemId: item.id,
          targetParentId: currentParentId || undefined,
        }).unwrap();
        refetchStructure();
        Alert.alert("Успешно", "Копия создана");
      } catch (e) {
        if (isStorageQuotaExceededError(e)) {
          const detail = getStorageQuotaAlertMessage(e);
          Alert.alert(
            "Недостаточно места",
            detail
              ? `${detail}\n\nУдалите лишние файлы или обратитесь за увеличением квоты.`
              : "В хранилище не хватает места для копии."
          );
        } else {
          Alert.alert("Ошибка", "Не удалось создать копию");
        }
      }
    },
    [storageId, resourceId, copyItem, currentParentId, refetchStructure]
  );

  const handleMove = useCallback(
    (item: StorageItem) => {
      setSelectedItem(item);
      setMoveModalVisible(true);
    },
    [setSelectedItem, setMoveModalVisible]
  );

  const handleConfirmMove = useCallback(
    async (newParentId: string | null, selectedItem: StorageItem | null) => {
      if (!selectedItem || !storageId) return;
      if (
        selectedItem.isDirectory &&
        newParentId !== null &&
        newParentId !== undefined &&
        newParentId === selectedItem.id
      ) {
        Alert.alert(
          "Нельзя",
          "Нельзя переместить папку в саму себя. Выберите другую папку назначения."
        );
        return;
      }
      try {
        await moveItem({
          storageId,
          resourceId,
          itemId: selectedItem.id,
          newParentId,
        }).unwrap();
        if (effectiveResourceType === ResourceType.SHARED && resourceId) {
          dispatch(
            sharedApi.util.invalidateTags([
              { type: "Shared", id: resourceId },
              { type: "SharedResources", id: storageId },
            ])
          );
        }
        refetchStructure();
        setSelectedItem(null);
      } catch {
        Alert.alert("Ошибка", "Не удалось переместить");
      }
    },
    [
      storageId,
      resourceId,
      effectiveResourceType,
      moveItem,
      refetchStructure,
      dispatch,
      setSelectedItem,
    ]
  );

  const handleAddToFavorites = useCallback(
    async (item: StorageItem) => {
      if (!storageId) return;
      try {
        if (effectiveResourceType === ResourceType.SHARED) {
          console.log("addFavoriteFromShared", storageId, item.id);
          await addFavoriteFromShared({
            storageId,
            itemId: item.id,
          }).unwrap();
        } else {
          await addFavorite({
            storageId,
            itemId: item.id,
          }).unwrap();
        }
      } catch {
        Alert.alert("Ошибка", "Не удалось добавить в избранное");
      }
    },
    [storageId, effectiveResourceType, addFavorite, addFavoriteFromShared]
  );

  const handleRemoveFromFavorites = useCallback(
    async (item: StorageItem) => {
      if (!storageId) return;
      try {
        if (effectiveResourceType === ResourceType.SHARED) {
          console.log("removeFavoriteFromShared", storageId, item.id);
          await removeFavoriteFromShared({
            storageId,
            itemId: item.id,
          }).unwrap();
        } else {
          await removeFavorite({
            storageId,
            itemId: item.id,
          }).unwrap();
        }
      } catch {
        Alert.alert("Ошибка", "Не удалось удалить из избранного");
      }
    },
    [storageId, effectiveResourceType, removeFavorite, removeFavoriteFromShared]
  );

  const handleAddTag = useCallback(
    (item: StorageItem) => {
      setSelectedItem(item);
      setTagsModalVisible(true);
    },
    [setSelectedItem, setTagsModalVisible]
  );

  const handleAddItemTag = useCallback(
    async (tag: string, selectedItem: StorageItem | null) => {
      if (!selectedItem || !storageId) return;
      try {
        const currentTags = selectedItem.tags || [];
        if (currentTags.includes(tag)) {
          Alert.alert("Ошибка", "Тег уже существует");
          return;
        }
        await updateItemTags({
          storageId,
          resourceId,
          itemId: selectedItem.id,
          tags: [...currentTags, tag],
        }).unwrap();
        refetchStructure();
      } catch {
        Alert.alert("Ошибка", "Не удалось добавить тег");
      }
    },
    [storageId, resourceId, updateItemTags, refetchStructure]
  );

  const handleRemoveItemTag = useCallback(
    async (tag: string, selectedItem: StorageItem | null) => {
      if (!selectedItem || !storageId) return;
      try {
        const currentTags = selectedItem.tags || [];
        await updateItemTags({
          storageId,
          resourceId,
          itemId: selectedItem.id,
          tags: currentTags.filter((t) => t !== tag),
        }).unwrap();
        refetchStructure();
      } catch {
        Alert.alert("Ошибка", "Не удалось удалить тег");
      }
    },
    [storageId, resourceId, updateItemTags, refetchStructure]
  );

  const handleShare = useCallback(
    (item: StorageItem) => {
      setSelectedItem(item);
      setGrantAccessModalVisible(true);
    },
    [setSelectedItem, setGrantAccessModalVisible]
  );

  const handleGrantAccess = useCallback(
    async (
      friendId: number,
      selectedItem: StorageItem | null,
      role: AccessRole = AccessRole.WRITE
    ) => {
      if (!selectedItem || !storageId) return;
      try {
        await grantPermissions({
          storageId,
          resourceId: selectedItem.id,
          resourceType: effectiveResourceType,
          targetUserId: friendId,
          role,
        }).unwrap();
        refetchStructure();
        setGrantAccessModalVisible(false);
        Alert.alert("Успешно", "Доступ предоставлен");
        setSelectedItem(null);
      } catch {
        Alert.alert("Ошибка", "Не удалось предоставить доступ");
      }
    },
    [
      storageId,
      effectiveResourceType,
      grantPermissions,
      refetchStructure,
      setGrantAccessModalVisible,
      setSelectedItem,
    ]
  );

  const handleViewPermissions = useCallback(
    (item: StorageItem) => {
      setSelectedItem(item);
      setPermissionsModalVisible(true);
    },
    [setSelectedItem, setPermissionsModalVisible]
  );

  const handleInfo = useCallback(
    (item: StorageItem) => {
      setSelectedItem(item);
      setInfoModalVisible(true);
    },
    [setSelectedItem, setInfoModalVisible]
  );

  const handleMoveToTrash = useCallback(
    async (item: StorageItem) => {
      if (!storageId) return;
      try {
        await moveToTrash({
          storageId,
          resourceId,
          itemId: item.id,
        }).unwrap();
        refetchStructure();
      } catch {
        Alert.alert("Ошибка", "Не удалось переместить в корзину");
      }
    },
    [storageId, resourceId, moveToTrash, refetchStructure]
  );

  return {
    handleDownloadFile,
    handleConvert,
    handleRename,
    handleConfirmRename,
    handleCopy,
    handleMove,
    handleConfirmMove,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleAddTag,
    handleAddItemTag,
    handleRemoveItemTag,
    handleShare,
    handleGrantAccess,
    handleViewPermissions,
    handleInfo,
    handleMoveToTrash,
  };
};

