import type { GetFavoritesResponse } from "@/api/types/favorites";
import {
  useBatchCopyStorageItemsMutation,
  useBatchMoveStorageItemsMutation,
} from "@/api/storageApi";
import { StorageItem } from "@/api/types/storage";
import type { AppDispatch } from "@/store/store";
import { createStorageMultiSelectMenuItems } from "@/widgets/storage/menu/createStorageMultiSelectMenu";
import { showStorageBatchResultAlert } from "@/widgets/storage/utils/storageBatchAlert";
import { useI18n } from "@/shared/localization";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert } from "react-native";
import { stashMoveFromFavoritesBatch } from "../../../pendingMoveFromFavorites";
import type { ResolvedStorageSectionOptions, StorageSectionProps } from "../types";
import { useStorageSectionBatchGuards } from "./useStorageSectionBatchGuards";
import { useStorageSectionBatchMore } from "./useStorageSectionBatchMore";

const STORAGE_BATCH_MAX = 100;

type BatchDest = { kind: "move" | "copy"; itemIds: string[] };

export function useStorageSectionBatch(params: {
  storageId: string;
  navigationParentId: string | null;
  options: ResolvedStorageSectionOptions;
  externalData: StorageSectionProps["externalData"];
  sharedContext: StorageSectionProps["sharedContext"];
  favorites: GetFavoritesResponse["items"] | undefined;
  dispatch: AppDispatch;
  isFavoritesVirtualRoot: boolean;
  navigateTo: (segmentId: string | null, index: number) => void;
  openFolder: (folder: StorageItem) => void;
  refetchStructure: () => void;
  buildBatchBody: (itemIds: string[]) => {
    storageId: string;
    itemIds: string[];
    resourceId?: string;
  };
}) {
  const {
    storageId,
    navigationParentId,
    options,
    externalData,
    sharedContext,
    favorites,
    dispatch,
    isFavoritesVirtualRoot,
    navigateTo,
    openFolder,
    refetchStructure,
    buildBatchBody,
  } = params;

  const { tl } = useI18n();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [batchDestination, setBatchDestination] = useState<BatchDest | null>(
    null
  );
  const [batchTagsModalVisible, setBatchTagsModalVisible] = useState(false);
  const [batchTagsInput, setBatchTagsInput] = useState("");

  const [batchMoveItems] = useBatchMoveStorageItemsMutation();
  const [batchCopyItems] = useBatchCopyStorageItemsMutation();

  const resetMultiSelect = useCallback(() => {
    setSelectedIds(new Set());
    setBatchDestination(null);
    setBatchTagsModalVisible(false);
    setBatchTagsInput("");
  }, []);

  const toggleSelection = useCallback((item: StorageItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }, []);

  const ensureBatchSize = useCallback((ids: string[]) => {
    if (ids.length === 0) {
      Alert.alert(tl("Выбор"), tl("Отметьте хотя бы один элемент"));
      return false;
    }
    if (ids.length > STORAGE_BATCH_MAX) {
      Alert.alert(
        tl("Слишком много"),
        `${tl("Не более")} ${STORAGE_BATCH_MAX} ${tl("элементов за один запрос")}`
      );
      return false;
    }
    return true;
  }, []);

  const {
    handleBatchMoveToTrash,
    handleBatchAddFavorites,
    handleBatchTagsSubmit,
  } = useStorageSectionBatchMore({
    selectedIds,
    storageId,
    ensureBatchSize,
    buildBatchBody,
    resetMultiSelect,
    refetchStructure,
    options,
    favorites,
    sharedContext,
    dispatch,
    batchTagsInput,
    setBatchTagsModalVisible,
    setBatchTagsInput,
  });

  const openBatchDestination = useCallback(
    (kind: "move" | "copy") => {
      const ids = [...selectedIds];
      if (!ensureBatchSize(ids)) return;
      if (
        kind === "move" &&
        isFavoritesVirtualRoot &&
        options.redirectMoveToStorageTab
      ) {
        stashMoveFromFavoritesBatch(ids);
        resetMultiSelect();
        router.push("/(tabs)/storage");
        return;
      }
      setBatchDestination({ kind, itemIds: ids });
      setSelectedIds(new Set());
    },
    [
      selectedIds,
      ensureBatchSize,
      isFavoritesVirtualRoot,
      options.redirectMoveToStorageTab,
      resetMultiSelect,
      router,
    ]
  );

  const confirmBatchDestination = useCallback(async () => {
    if (!batchDestination || !storageId) return;
    const { kind, itemIds } = batchDestination;
    const parent = navigationParentId;
    if (
      kind === "move" &&
      parent !== null &&
      parent !== undefined &&
      itemIds.includes(parent)
    ) {
      Alert.alert(
        tl("Нельзя"),
        tl("Нельзя переместить элементы в выбранную папку")
      );
      return;
    }
    try {
      if (kind === "move") {
        const result = await batchMoveItems({
          ...buildBatchBody(itemIds),
          newParentId: parent,
        }).unwrap();
        showStorageBatchResultAlert(result, tl("Перемещение"), tl);
      } else {
        const result = await batchCopyItems({
          ...buildBatchBody(itemIds),
          targetParentId: parent,
        }).unwrap();
        showStorageBatchResultAlert(result, tl("Копирование"), tl);
      }
      resetMultiSelect();
      refetchStructure();
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      Alert.alert(
        tl("Ошибка"),
        String(err?.data?.message ?? err?.message ?? tl("Запрос не выполнен"))
      );
    }
  }, [
    batchDestination,
    storageId,
    navigationParentId,
    batchMoveItems,
    batchCopyItems,
    buildBatchBody,
    resetMultiSelect,
    refetchStructure,
  ]);

  const multiSelectMenuItems = useMemo(
    () =>
      createStorageMultiSelectMenuItems(
        selectedIds.size,
        {
          onMove: () => openBatchDestination("move"),
          onCopy: () => openBatchDestination("copy"),
          onMoveToTrash: handleBatchMoveToTrash,
          onAddToFavorites: handleBatchAddFavorites,
          onSetTags: () => setBatchTagsModalVisible(true),
          onCancel: resetMultiSelect,
        },
        {
          hideBatchCopy:
            isFavoritesVirtualRoot && options.redirectMoveToStorageTab,
        }
      ),
    [
      selectedIds.size,
      openBatchDestination,
      handleBatchMoveToTrash,
      handleBatchAddFavorites,
      resetMultiSelect,
      isFavoritesVirtualRoot,
      options.redirectMoveToStorageTab,
    ]
  );

  const {
    isBatchMoveDestinationInvalid,
    handleNavigateWithBatchGuard,
    handleFolderPressWithBatchGuard,
  } = useStorageSectionBatchGuards({
    batchDestination,
    navigationParentId,
    externalData,
    navigateTo,
    openFolder,
  });

  return {
    selectedIds,
    setSelectedIds,
    batchDestination,
    setBatchDestination,
    batchTagsModalVisible,
    setBatchTagsModalVisible,
    batchTagsInput,
    setBatchTagsInput,
    resetMultiSelect,
    toggleSelection,
    openBatchDestination,
    confirmBatchDestination,
    handleBatchTagsSubmit,
    multiSelectMenuItems,
    isBatchMoveDestinationInvalid,
    handleNavigateWithBatchGuard,
    handleFolderPressWithBatchGuard,
  };
}
