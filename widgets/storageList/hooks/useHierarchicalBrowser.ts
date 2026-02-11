import { useCallback, useMemo, useState } from "react";

export interface HierarchicalBrowserPathSegment {
  id: string | null;
  name: string;
}

export interface HierarchicalBrowserItemLike {
  id: string;
  name: string;
  parentId: string | null;
  isDirectory: boolean;
}

export interface UseHierarchicalBrowserOptions<TItem extends HierarchicalBrowserItemLike> {
  items?: TItem[];
  rootLabel: string;
  /**
   * If provided, will be used instead of `item.parentId` when building hierarchy.
   * Useful for trash where "orphan" items should be placed at root.
   */
  getParentId?: (item: TItem, ctx: { ids: Set<string> }) => string | null;
  /**
   * Item-level filter. Returning false excludes an item from navigation & rendering.
   */
  filter?: (item: TItem) => boolean;
  /**
   * Custom sort for visible items.
   */
  sort?: (a: TItem, b: TItem) => number;
  initialParentId?: string | null;
}

const defaultSort = <TItem extends HierarchicalBrowserItemLike>(a: TItem, b: TItem) => {
  if (a.isDirectory && !b.isDirectory) return -1;
  if (!a.isDirectory && b.isDirectory) return 1;
  return a.name.localeCompare(b.name);
};

export const useHierarchicalBrowser = <
  TItem extends HierarchicalBrowserItemLike
>({
  items,
  rootLabel,
  getParentId,
  filter,
  sort,
  initialParentId = null,
}: UseHierarchicalBrowserOptions<TItem>) => {
  const [currentParentId, setCurrentParentId] = useState<string | null>(
    initialParentId
  );
  const [path, setPath] = useState<HierarchicalBrowserPathSegment[]>([
    { id: null, name: rootLabel },
  ]);

  const ids = useMemo(() => new Set((items ?? []).map((i) => i.id)), [items]);

  const resolvedParentId = useCallback(
    (item: TItem) => (getParentId ? getParentId(item, { ids }) : item.parentId),
    [getParentId, ids]
  );

  const visibleItems = useMemo(() => {
    const list = (items ?? []).filter((item) => {
      if (filter && !filter(item)) return false;
      return resolvedParentId(item) === currentParentId;
    });

    return list.sort(sort ?? defaultSort);
  }, [items, filter, resolvedParentId, currentParentId, sort]);

  const openFolder = useCallback((folder: TItem) => {
    setCurrentParentId(folder.id);
    setPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  }, []);

  const navigateTo = useCallback((segmentId: string | null, index: number) => {
    setCurrentParentId(segmentId);
    setPath((prev) => prev.slice(0, index + 1));
  }, []);

  const resetToRoot = useCallback(() => {
    setCurrentParentId(null);
    setPath([{ id: null, name: rootLabel }]);
  }, [rootLabel]);

  return {
    currentParentId,
    setCurrentParentId,
    path,
    setPath,
    visibleItems,
    openFolder,
    navigateTo,
    resetToRoot,
  };
};


