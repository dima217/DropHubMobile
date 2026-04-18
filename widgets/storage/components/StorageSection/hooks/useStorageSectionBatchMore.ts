import {
  useBatchAddFavoritesFromSharedMutation,
  useBatchAddFavoritesFromStorageMutation,
} from "@/api/favorites";
import type { GetFavoritesResponse } from "@/api/types/favorites";
import {
  useBatchSoftDeleteStorageItemsMutation,
  useBatchUpdateStorageItemTagsMutation,
  useMoveStorageItemToTrashMutation,
} from "@/api/storageApi";
import type { AppDispatch } from "@/store/store";
import { showStorageBatchResultAlert } from "@/widgets/storage/utils/storageBatchAlert";
import { useCallback } from "react";
import { Alert } from "react-native";
import { runFavoritesSelectionToTrash } from "../favoriteBatchTrash";
import type { ResolvedStorageSectionOptions, StorageSectionProps } from "../types";

type Ensure = (ids: string[]) => boolean;

export function useStorageSectionBatchMore(params: {
  selectedIds: Set<string>;
  storageId: string;
  ensureBatchSize: Ensure;
  buildBatchBody: (itemIds: string[]) => {
    storageId: string;
    itemIds: string[];
    resourceId?: string;
  };
  resetMultiSelect: () => void;
  refetchStructure: () => void;
  options: ResolvedStorageSectionOptions;
  favorites: GetFavoritesResponse["items"] | undefined;
  sharedContext: StorageSectionProps["sharedContext"];
  dispatch: AppDispatch;
  batchTagsInput: string;
  setBatchTagsModalVisible: (v: boolean) => void;
  setBatchTagsInput: (t: string) => void;
}) {
  const {
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
  } = params;

  const [batchSoftDeleteItems] = useBatchSoftDeleteStorageItemsMutation();
  const [moveItemToTrashOne] = useMoveStorageItemToTrashMutation();
  const [batchUpdateTags] = useBatchUpdateStorageItemTagsMutation();
  const [batchAddFavStorage] = useBatchAddFavoritesFromStorageMutation();
  const [batchAddFavShared] = useBatchAddFavoritesFromSharedMutation();

  const handleBatchMoveToTrash = useCallback(() => {
    const ids = [...selectedIds];
    if (!ensureBatchSize(ids) || !storageId) return;
    Alert.alert(
      "В корзину",
      `Переместить в корзину элементов: ${ids.length}?`,
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "В корзину",
          style: "destructive",
          onPress: async () => {
            try {
              if (options.favoritesBrowseMode && favorites) {
                await runFavoritesSelectionToTrash({
                  storageId,
                  ids,
                  favoritesItems: favorites,
                  deleteStorageBatch: (itemIds) =>
                    batchSoftDeleteItems({ storageId, itemIds }).unwrap(),
                  deleteSharedOne: (itemId) =>
                    moveItemToTrashOne({ storageId, itemId }).unwrap(),
                  dispatch,
                });
              } else {
                const result = await batchSoftDeleteItems(
                  buildBatchBody(ids)
                ).unwrap();
                showStorageBatchResultAlert(result, "В корзину");
              }
              resetMultiSelect();
              refetchStructure();
            } catch (e: unknown) {
              const err = e as { data?: { message?: string }; message?: string };
              Alert.alert(
                "Ошибка",
                String(err?.data?.message ?? err?.message ?? "Запрос не выполнен")
              );
            }
          },
        },
      ]
    );
  }, [
    selectedIds,
    storageId,
    ensureBatchSize,
    batchSoftDeleteItems,
    buildBatchBody,
    resetMultiSelect,
    refetchStructure,
    options.favoritesBrowseMode,
    favorites,
    moveItemToTrashOne,
    dispatch,
  ]);

  const handleBatchAddFavorites = useCallback(async () => {
    const ids = [...selectedIds];
    if (!ensureBatchSize(ids) || !storageId) return;
    try {
      const result = sharedContext
        ? await batchAddFavShared({ storageId, itemIds: ids }).unwrap()
        : await batchAddFavStorage({ storageId, itemIds: ids }).unwrap();
      const skipped =
        "skippedDuplicate" in result ? result.skippedDuplicate : undefined;
      showStorageBatchResultAlert(
        result,
        skipped != null
          ? `В избранное (пропущено дубликатов: ${skipped})`
          : "В избранное"
      );
      resetMultiSelect();
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      Alert.alert(
        "Ошибка",
        String(err?.data?.message ?? err?.message ?? "Запрос не выполнен")
      );
    }
  }, [
    selectedIds,
    storageId,
    sharedContext,
    ensureBatchSize,
    batchAddFavShared,
    batchAddFavStorage,
    resetMultiSelect,
  ]);

  const handleBatchTagsSubmit = useCallback(async () => {
    const ids = [...selectedIds];
    if (!ensureBatchSize(ids) || !storageId) return;
    const tags = batchTagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    try {
      const result = await batchUpdateTags({
        ...buildBatchBody(ids),
        tags,
      }).unwrap();
      showStorageBatchResultAlert(result, "Теги обновлены");
      setBatchTagsModalVisible(false);
      setBatchTagsInput("");
      resetMultiSelect();
      refetchStructure();
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      Alert.alert(
        "Ошибка",
        String(err?.data?.message ?? err?.message ?? "Запрос не выполнен")
      );
    }
  }, [
    selectedIds,
    storageId,
    batchTagsInput,
    ensureBatchSize,
    batchUpdateTags,
    buildBatchBody,
    resetMultiSelect,
    refetchStructure,
    setBatchTagsModalVisible,
    setBatchTagsInput,
  ]);

  return {
    handleBatchMoveToTrash,
    handleBatchAddFavorites,
    handleBatchTagsSubmit,
  };
}
