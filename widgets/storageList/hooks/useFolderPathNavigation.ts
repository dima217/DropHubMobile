import { useCallback, useState } from "react";

export interface FolderPathSegment {
  id: string | null;
  name: string;
}

export const useFolderPathNavigation = (rootLabel: string) => {
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [path, setPath] = useState<FolderPathSegment[]>([
    { id: null, name: rootLabel },
  ]);

  const openFolder = useCallback((folder: { id: string; name: string }) => {
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
    openFolder,
    navigateTo,
    resetToRoot,
  };
};


