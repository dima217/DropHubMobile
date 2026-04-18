import { useCallback } from "react";
import { useStorageScreenHandlers } from "../../../hooks/useStorageScreenHandlers";

type CreateFolderMut = ReturnType<
  typeof import("@/api").useCreateStorageFolderMutation
>[0];
type RemoveTagsMut = ReturnType<
  typeof import("@/api").useRemoveStorageTagsMutation
>[0];

export function useStorageSectionScreenHandlersBridge(params: {
  storageId: string;
  mutationParentId: string | null;
  createFolder: CreateFolderMut;
  removeStorageTags: RemoveTagsMut;
  refetchStructure: () => void;
  selectedItemState: ReturnType<
    typeof import("../../../hooks/useTagsState").useSelectedItemState
  >["selectedItemState"];
  actions: ReturnType<
    typeof import("../../../hooks/useStorageActions").useStorageActions
  >;
  createFolderResourceId: string | undefined;
  addItemTag: (tag: string) => void;
  removeItemTag: (tag: string) => void;
}) {
  const {
    storageId,
    mutationParentId,
    createFolder,
    removeStorageTags,
    refetchStructure,
    selectedItemState,
    actions,
    createFolderResourceId,
    addItemTag,
    removeItemTag,
  } = params;

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
    currentParentId: mutationParentId,
    createFolder: (args: {
      storageId: string;
      name: string;
      parentId?: string;
      isDirectory: boolean;
    }) => createFolder(args).unwrap(),
    removeStorageTags: (args: { storageId: string; tags: string[] }) =>
      removeStorageTags(args).unwrap(),
    refetchStructure,
    selectedItem: selectedItemState,
    actions,
    createFolderResourceId,
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

  return {
    handleCreateFolder,
    handleRemoveGlobalTag,
    handleConfirmRename,
    handleConfirmMove,
    handleGrantAccess,
    handleAddItemTag,
    handleRemoveItemTag,
  };
}
