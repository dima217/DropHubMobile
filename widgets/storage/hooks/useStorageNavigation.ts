import { StorageItem } from "@/api/types/storage";
import { useEffect, useRef } from "react";

interface UseStorageNavigationParams {
  targetParentId?: string;
  structure?: StorageItem[];
  setCurrentParentId: (id: string | null) => void;
  setPath: (path: { id: string | null; name: string }[]) => void;
}

export const useStorageNavigation = ({
  targetParentId,
  structure,
  setCurrentParentId,
  setPath,
}: UseStorageNavigationParams) => {
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    if (!targetParentId || !structure || hasNavigatedRef.current) return;

    hasNavigatedRef.current = true;

    const targetId = targetParentId === "" ? null : targetParentId;

    const buildPath = (
      folderId: string | null
    ): { id: string | null; name: string }[] => {
      const segments: { id: string | null; name: string }[] = [
        { id: null, name: "Root" },
      ];

      if (!folderId) return segments;

      const chain: StorageItem[] = [];
      let currentId: string | null = folderId;

      while (currentId) {
        const item = structure.find((s) => s.id === currentId);
        if (!item) break;
        chain.unshift(item);
        currentId = item.parentId;
      }

      for (const item of chain) {
        segments.push({ id: item.id, name: item.name });
      }

      return segments;
    };

    const newPath = buildPath(targetId);

    setCurrentParentId(targetId);
    setPath(newPath);
  }, [targetParentId, structure, setCurrentParentId, setPath]);
};
