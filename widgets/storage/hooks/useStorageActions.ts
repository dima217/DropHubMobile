import {
  useAddFavoriteFromStorageMutation,
  useRemoveFavoriteFromStorageMutation,
} from "@/api/favorites";
import { useLazyDownloadStorageFileQuery } from "@/api/fileApi";
import { useGrantPermissionsMutation } from "@/api/sharedApi";
import {
  useCopyStorageItemMutation,
  useMoveStorageItemMutation,
  useMoveStorageItemToTrashMutation,
  useUpdateStorageItemMutation,
  useUpdateStorageItemTagsMutation,
} from "@/api/storageApi";
import { AccessRole } from "@/api/types/room";
import { ResourceType } from "@/api/types/shared";
import { StorageItem } from "@/api/types/storage";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import { useCallback } from "react";
import { Alert } from "react-native";

interface UseStorageActionsProps {
  storageId: string;
  currentParentId: string | null;
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
  refetchStructure,
  onConvertRequest,
  setSelectedItem,
  setTagsModalVisible,
  setGrantAccessModalVisible,
  setPermissionsModalVisible,
  setRenameModalVisible,
  setInfoModalVisible,
  setMoveModalVisible,
  setCreateFolderModalVisible,
}: UseStorageActionsProps) => {
  const [updateItem] = useUpdateStorageItemMutation();
  const [copyItem] = useCopyStorageItemMutation();
  const [moveItem] = useMoveStorageItemMutation();
  const [updateItemTags] = useUpdateStorageItemTagsMutation();
  const [moveToTrash] = useMoveStorageItemToTrashMutation();
  const [addFavorite] = useAddFavoriteFromStorageMutation();
  const [removeFavorite] = useRemoveFavoriteFromStorageMutation();
  const [grantPermissions] = useGrantPermissionsMutation();
  const [downloadStorageFile] = useLazyDownloadStorageFileQuery();

  const handleDownloadFile = useCallback(
    async (item: StorageItem) => {
      if (!storageId || !item.fileId) return;
      try {
        const response = await downloadStorageFile({
          storageId,
          fileIds: [item.fileId],
        }).unwrap();
        const uploader = createUploader(UploadProvider.MINIO);
        for (const { url } of response) {
          await uploader.download(url);
        }
        Alert.alert("Успешно", "Файл загружен");
      } catch {
        Alert.alert("Ошибка", "Не удалось скачать файл");
      }
    },
    [storageId, downloadStorageFile]
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
          itemId: selectedItem.id,
          newName,
        }).unwrap();
        refetchStructure();
        setSelectedItem(null);
      } catch {
        Alert.alert("Ошибка", "Не удалось переименовать");
      }
    },
    [storageId, updateItem, refetchStructure, setSelectedItem]
  );

  const handleCopy = useCallback(
    async (item: StorageItem) => {
      if (!storageId) return;
      try {
        await copyItem({
          storageId,
          itemId: item.id,
          targetParentId: currentParentId || undefined,
        }).unwrap();
        refetchStructure();
        Alert.alert("Успешно", "Копия создана");
      } catch {
        Alert.alert("Ошибка", "Не удалось создать копию");
      }
    },
    [storageId, copyItem, currentParentId, refetchStructure]
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
      try {
        await moveItem({
          storageId,
          itemId: selectedItem.id,
          newParentId: newParentId || "",
        }).unwrap();
        refetchStructure();
        setSelectedItem(null);
      } catch {
        Alert.alert("Ошибка", "Не удалось переместить");
      }
    },
    [storageId, moveItem, refetchStructure, setSelectedItem]
  );

  const handleAddToFavorites = useCallback(
    async (item: StorageItem) => {
      if (!storageId) return;
      try {
        await addFavorite({
          storageId,
          itemId: item.id,
        }).unwrap();
      } catch {
        Alert.alert("Ошибка", "Не удалось добавить в избранное");
      }
    },
    [storageId, addFavorite]
  );

  const handleRemoveFromFavorites = useCallback(
    async (item: StorageItem) => {
      if (!storageId) return;
      try {
        await removeFavorite({
          storageId,
          itemId: item.id,
        }).unwrap();
      } catch {
        Alert.alert("Ошибка", "Не удалось удалить из избранного");
      }
    },
    [storageId, removeFavorite]
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
          itemId: selectedItem.id,
          tags: [...currentTags, tag],
        }).unwrap();
        refetchStructure();
      } catch {
        Alert.alert("Ошибка", "Не удалось добавить тег");
      }
    },
    [storageId, updateItemTags, refetchStructure]
  );

  const handleRemoveItemTag = useCallback(
    async (tag: string, selectedItem: StorageItem | null) => {
      if (!selectedItem || !storageId) return;
      try {
        const currentTags = selectedItem.tags || [];
        await updateItemTags({
          storageId,
          itemId: selectedItem.id,
          tags: currentTags.filter((t) => t !== tag),
        }).unwrap();
        refetchStructure();
      } catch {
        Alert.alert("Ошибка", "Не удалось удалить тег");
      }
    },
    [storageId, updateItemTags, refetchStructure]
  );

  const handleShare = useCallback(
    (item: StorageItem) => {
      setSelectedItem(item);
      setGrantAccessModalVisible(true);
    },
    [setSelectedItem, setGrantAccessModalVisible]
  );

  const handleGrantAccess = useCallback(
    async (friendId: number, selectedItem: StorageItem | null) => {
      if (!selectedItem || !storageId) return;
      try {
        await grantPermissions({
          storageId,
          resourceId: selectedItem.id,
          resourceType: ResourceType.STORAGE,
          targetUserId: friendId,
          role: AccessRole.WRITE,
        }).unwrap();
        Alert.alert("Успешно", "Доступ предоставлен");
        setSelectedItem(null);
      } catch {
        Alert.alert("Ошибка", "Не удалось предоставить доступ");
      }
    },
    [storageId, grantPermissions, setSelectedItem]
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
          itemId: item.id,
        }).unwrap();
        refetchStructure();
      } catch {
        Alert.alert("Ошибка", "Не удалось переместить в корзину");
      }
    },
    [storageId, moveToTrash, refetchStructure]
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

