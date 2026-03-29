// useSelectedItemState.ts
import { StorageItem } from "@/api/types/storage";
import { useCallback, useEffect, useMemo, useState } from "react";

type UseSelectedItemStateParams = {
  storageTags?: string[];
  selectedItemFromProps: StorageItem | null;
  /** Current folder items from structure; when they change (e.g. after refetch), overrides for these ids are cleared */
  currentFolderItemIds?: Set<string>;
};

export const useSelectedItemState = ({
  storageTags = [],
  selectedItemFromProps,
  currentFolderItemIds,
}: UseSelectedItemStateParams) => {
  const [selectedItem, setSelectedItem] =
    useState<StorageItem | null>(selectedItemFromProps);

  const [globalTags, setGlobalTags] = useState<string[]>(storageTags);

  /** Local overrides of item tags for optimistic UI (list and modal update before refetch) */
  const [itemTagsOverrides, setItemTagsOverrides] = useState<
    Record<string, string[]>
  >({});

  useEffect(() => {
    setSelectedItem(selectedItemFromProps);
  }, [selectedItemFromProps]);

  useEffect(() => {
    setGlobalTags((prev) =>
      prev.length === storageTags.length &&
      prev.every((t, i) => t === storageTags[i])
        ? prev
        : storageTags
    );
  }, [storageTags]);

  // After structure refetch, clear overrides for items in current folder so we use server data
  useEffect(() => {
    if (!currentFolderItemIds?.size) return;
    setItemTagsOverrides((prev) => {
      const next = { ...prev };
      currentFolderItemIds.forEach((id) => delete next[id]);
      return Object.keys(next).length === Object.keys(prev).length ? prev : next;
    });
  }, [currentFolderItemIds]);

  const itemTags = useMemo(() => {
    const base = selectedItem?.tags || [];
    const overrides = selectedItem ? itemTagsOverrides[selectedItem.id] : undefined;
    return overrides ?? base;
  }, [selectedItem, itemTagsOverrides]);

  const addGlobalTag = (tag: string) => {
    if (!globalTags.includes(tag)) {
      setGlobalTags((prev) => [...prev, tag]);
    }
  };

  const removeGlobalTag = (tag: string) => {
    setGlobalTags((prev) => prev.filter((t) => t !== tag));
  };

  // ===== ITEM TAGS =====

  const addItemTag = useCallback((tag: string) => {
    setSelectedItem((prev) => {
      if (!prev || (prev.tags || []).includes(tag)) return prev;
      const nextTags = [...(prev.tags || []), tag];
      setItemTagsOverrides((o) => ({ ...o, [prev.id]: nextTags }));
      return { ...prev, tags: nextTags };
    });
  }, []);

  const removeItemTag = useCallback((tag: string) => {
    setSelectedItem((prev) => {
      if (!prev) return prev;
      const nextTags = (prev.tags || []).filter((t) => t !== tag);
      setItemTagsOverrides((o) => ({ ...o, [prev.id]: nextTags }));
      return { ...prev, tags: nextTags };
    });
  }, []);

  const updateSelectedItem = (updated: StorageItem) => {
    setSelectedItem(updated);
  };

  /** Resolve tags for an item: use local override if present, else server tags */
  const getItemTags = useCallback(
    (itemId: string, serverTags: string[]): string[] =>
      itemTagsOverrides[itemId] ?? serverTags,
    [itemTagsOverrides]
  );

  return {
    selectedItemState: selectedItem,
    setSelectedItem,
    updateSelectedItem,

    globalTags,
    itemTags,
    getItemTags,

    addGlobalTag,
    removeGlobalTag,
    addItemTag,
    removeItemTag,
  };
};
