import { StorageItem } from "@/api/types/storage";
import { useCallback } from "react";
import { Alert } from "react-native";

interface StorageActions {
  handleConfirmRename: (newName: string, selectedItem: StorageItem | null) => void;
  handleConfirmMove: (
    newParentId: string | null,
    selectedItem: StorageItem | null
  ) => void;
  handleAddItemTag: (tag: string, selectedItem: StorageItem | null) => void;
  handleRemoveItemTag: (tag: string, selectedItem: StorageItem | null) => void;
  handleGrantAccess: (
    friendId: number,
    selectedItem: StorageItem | null
  ) => void;
}

interface UseStorageScreenHandlersProps {
  storageId: string;
  currentParentId: string | null;
  createFolder: (args: any) => Promise<any>;
  removeStorageTags: (args: any) => Promise<any>;
  refetchStructure: () => void;
  selectedItem: StorageItem | null;
  actions: StorageActions;
}

export const useStorageScreenHandlers = ({
  storageId,
  currentParentId,
  createFolder,
  removeStorageTags,
  refetchStructure,
  selectedItem,
  actions,
}: UseStorageScreenHandlersProps) => {
  const handleCreateFolder = useCallback(async () => {
    if (!storageId) return;
    Alert.prompt(
      "Новая папка",
      "Введите название папки",
      async (name) => {
        if (!name || !name.trim()) return;
        try {
          await createFolder({
            storageId,
            name: name.trim(),
            parentId: currentParentId || undefined,
            isDirectory: true,
          });
          refetchStructure();
        } catch {
          Alert.alert("Ошибка", "Не удалось создать папку");
        }
      },
      "plain-text"
    );
  }, [storageId, currentParentId, createFolder, refetchStructure]);

  const handleRemoveGlobalTag = useCallback(
    async (tag: string) => {
      if (!storageId) return;
      try {
        await removeStorageTags({
          storageId,
          tags: [tag],
        });
      } catch {
        Alert.alert("Ошибка", "Не удалось удалить тег");
      }
    },
    [storageId, removeStorageTags]
  );

  const handleConfirmRename = useCallback(
    (newName: string) => {
      actions.handleConfirmRename(newName, selectedItem);
    },
    [actions, selectedItem]
  );

  const handleConfirmMove = useCallback(
    (newParentId: string | null) => {
      actions.handleConfirmMove(newParentId, selectedItem);
    },
    [actions, selectedItem]
  );

  const handleAddItemTag = useCallback(
    (tag: string) => {
      actions.handleAddItemTag(tag, selectedItem);
    },
    [actions, selectedItem]
  );

  const handleRemoveItemTag = useCallback(
    (tag: string) => {
      actions.handleRemoveItemTag(tag, selectedItem);
    },
    [actions, selectedItem]
  );

  const handleGrantAccess = useCallback(
    (friendId: number) => {
      actions.handleGrantAccess(friendId, selectedItem);
    },
    [actions, selectedItem]
  );

  return {
    handleCreateFolder,
    handleRemoveGlobalTag,
    handleConfirmRename,
    handleConfirmMove,
    handleAddItemTag,
    handleRemoveItemTag,
    handleGrantAccess,
  };
};


