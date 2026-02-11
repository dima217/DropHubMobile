// useSelectedItemState.ts
import { StorageItem } from "@/api/types/storage";
import { useEffect, useMemo, useState } from "react";

type UseSelectedItemStateParams = {
  storageTags?: string[];
  selectedItemFromProps: StorageItem | null;
};

export const useSelectedItemState = ({
  storageTags = [],
  selectedItemFromProps,
}: UseSelectedItemStateParams) => {
  const [selectedItem, setSelectedItem] =
    useState<StorageItem | null>(selectedItemFromProps);

  const [globalTags, setGlobalTags] = useState<string[]>(storageTags);

  useEffect(() => {
    setSelectedItem(selectedItemFromProps);
  }, [selectedItemFromProps]);

  useEffect(() => {
    setGlobalTags(storageTags);
  }, [storageTags]);

  const itemTags = useMemo(() => {
    return selectedItem?.tags || [];
  }, [selectedItem]);


  const addGlobalTag = (tag: string) => {
    if (!globalTags.includes(tag)) {
      setGlobalTags((prev) => [...prev, tag]);
    }
  };

  const removeGlobalTag = (tag: string) => {
    setGlobalTags((prev) => prev.filter((t) => t !== tag));
  };

  // ===== ITEM TAGS =====

  const addItemTag = (tag: string) => {
    if (!selectedItem) return;

    if (!selectedItem.tags.includes(tag)) {
      setSelectedItem({
        ...selectedItem,
        tags: [...selectedItem.tags, tag],
      });
    }
  };

  const removeItemTag = (tag: string) => {
    if (!selectedItem) return;

    setSelectedItem({
      ...selectedItem,
      tags: selectedItem.tags.filter((t) => t !== tag),
    });
  };

  const updateSelectedItem = (updated: StorageItem) => {
    setSelectedItem(updated);
  };

  return {
    selectedItemState: selectedItem,
    setSelectedItem,
    updateSelectedItem,

    globalTags,
    itemTags,

    addGlobalTag,
    removeGlobalTag,
    addItemTag,
    removeItemTag,
  };
};
