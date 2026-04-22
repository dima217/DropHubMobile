import type { StorageItem } from "@/api/types/storage";
import { useI18n } from "@/shared/localization";
import { useCallback, useMemo } from "react";
import { Alert } from "react-native";
import type { StorageSectionProps } from "../types";

type BatchDest = { kind: "move" | "copy"; itemIds: string[] };

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

  const { tl } = useI18n();

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
        Alert.alert(tl("Нельзя"), tl("Нельзя переместить элементы в выбранную папку"));
        return;
      }
      (externalData?.onNavigate ?? navigateTo)(segmentId, index);
    },
    [batchMoveForbiddenIds, externalData?.onNavigate, navigateTo, tl]
  );

  const handleFolderPressWithBatchGuard = useCallback(
    (folder: StorageItem) => {
      if (batchMoveForbiddenIds?.has(folder.id)) {
        Alert.alert(tl("Нельзя"), tl("Нельзя переместить элементы в выбранную папку"));
        return;
      }
      (externalData?.onFolderPress ?? openFolder)(folder);
    },
    [batchMoveForbiddenIds, externalData?.onFolderPress, openFolder, tl]
  );

  return {
    batchMoveForbiddenIds,
    isBatchMoveDestinationInvalid,
    handleNavigateWithBatchGuard,
    handleFolderPressWithBatchGuard,
  };
}
