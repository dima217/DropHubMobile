import { StorageItem } from "@/api/types/storage";
import { AccessRole } from "@/api/types/room";
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
    selectedItem: StorageItem | null,
    role: AccessRole
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
  /** Для unified `/storage/create-item` в shared-ветке */
  createFolderResourceId?: string;
}

export const useStorageScreenHandlers = ({
  storageId,
  currentParentId,
  createFolder,
  removeStorageTags,
  refetchStructure,
  selectedItem,
  actions,
  createFolderResourceId,
}: UseStorageScreenHandlersProps) => {
  const handleCreateFolder = useCallback(
    async (name: string) => {
      if (!storageId) return;
  
      try {
        await createFolder({
          storageId,
          name: name.trim(),
          parentId: currentParentId ?? undefined,
          isDirectory: true,
          ...(createFolderResourceId
            ? { resourceId: createFolderResourceId }
            : {}),
        });
  
        refetchStructure();
      } catch {
        Alert.alert("Ошибка", "Не удалось создать папку");
      }
    },
    [storageId, currentParentId, createFolder, refetchStructure, createFolderResourceId]
  );  

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
    (friendId: number, role: AccessRole) => {
      actions.handleGrantAccess(friendId, selectedItem, role);
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


