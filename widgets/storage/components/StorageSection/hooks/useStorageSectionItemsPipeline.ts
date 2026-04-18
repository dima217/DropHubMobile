import { StorageItem } from "@/api/types/storage";
import { useMemo } from "react";
import { useSelectedItemState } from "../../../hooks/useTagsState";
import type { StorageSectionProps } from "../types";

type Params = {
  structure: StorageItem[] | undefined;
  navigationParentId: string | null;
  isAtLogicalRoot: boolean;
  initialItems: StorageItem[] | undefined;
  externalData: StorageSectionProps["externalData"];
  storageTags: string[];
  selectedItem: StorageItem | null;
};

export function useStorageSectionItemsPipeline(params: Params) {
  const {
    structure,
    navigationParentId,
    isAtLogicalRoot,
    initialItems,
    externalData,
    storageTags,
    selectedItem,
  } = params;

  const itemsInCurrentFolderRaw: StorageItem[] = useMemo(() => {
    if (externalData) {
      return externalData.items
        .filter((item) => !item.deletedAt)
        .sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
    }

    if (initialItems && isAtLogicalRoot) {
      return initialItems
        .filter((item) => !item.deletedAt)
        .sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
    }

    if (!structure) return [];
    return structure
      .filter((item) => item.parentId === navigationParentId && !item.deletedAt)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [structure, initialItems, isAtLogicalRoot, externalData, navigationParentId]);

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
    storageTags,
    selectedItemFromProps: selectedItem,
    currentFolderItemIds,
  });

  const itemsInCurrentFolder: StorageItem[] = useMemo(() => {
    return itemsInCurrentFolderRaw.map((item) => ({
      ...item,
      tags: getItemTags(item.id, item.tags || []),
    }));
  }, [itemsInCurrentFolderRaw, getItemTags]);

  const currentFolderFileNames = useMemo(
    () =>
      itemsInCurrentFolderRaw
        .filter((item) => !item.isDirectory)
        .map((item) => item.name),
    [itemsInCurrentFolderRaw]
  );

  return {
    itemsInCurrentFolder,
    globalTags,
    itemTags,
    selectedItemState,
    removeGlobalTag,
    addItemTag,
    removeItemTag,
    currentFolderFileNames,
  };
}
