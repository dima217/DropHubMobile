import type { StorageItem } from "@/api/types/storage";
import { useCallback, useMemo } from "react";
import { Alert } from "react-native";
import type { StorageSectionProps } from "../types";

type BatchDest = { kind: "move" | "copy"; itemIds: string[] };

const BLOCK_MSG = "Нельзя переместить элементы в выбранную папку";

export function useStorageSectionBatchGuards(params: {
  batchDestination: BatchDest | null;
  navigationParentId: string | null;
  externalData: StorageSectionProps["externalData"];
  navigateTo: (segmentId: string | null, index: number) => void;
  openFolder: (folder: StorageItem) => void;
}) {
  const {
    batchDestination,
    navigationParentId,
    externalData,
    navigateTo,
    openFolder,
  } = params;

  const batchMoveForbiddenIds = useMemo(() => {
    if (!batchDestination || batchDestination.kind !== "move") return null;
    return new Set(batchDestination.itemIds);
  }, [batchDestination]);

  const isBatchMoveDestinationInvalid = useMemo(() => {
    if (!batchDestination || batchDestination.kind !== "move") return false;
    const p = navigationParentId;
    if (p === null || p === undefined) return false;
    return batchDestination.itemIds.includes(p);
  }, [batchDestination, navigationParentId]);

  const handleNavigateWithBatchGuard = useCallback(
    (segmentId: string | null, index: number) => {
      if (
        batchMoveForbiddenIds &&
        segmentId !== null &&
        batchMoveForbiddenIds.has(segmentId)
      ) {
        Alert.alert("Нельзя", BLOCK_MSG);
        return;
      }
      (externalData?.onNavigate ?? navigateTo)(segmentId, index);
    },
    [batchMoveForbiddenIds, externalData?.onNavigate, navigateTo]
  );

  const handleFolderPressWithBatchGuard = useCallback(
    (folder: StorageItem) => {
      if (batchMoveForbiddenIds?.has(folder.id)) {
        Alert.alert("Нельзя", BLOCK_MSG);
        return;
      }
      (externalData?.onFolderPress ?? openFolder)(folder);
    },
    [batchMoveForbiddenIds, externalData?.onFolderPress, openFolder]
  );

  return {
    batchMoveForbiddenIds,
    isBatchMoveDestinationInvalid,
    handleNavigateWithBatchGuard,
    handleFolderPressWithBatchGuard,
  };
}
