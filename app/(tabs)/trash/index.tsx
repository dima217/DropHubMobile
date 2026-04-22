import {
  useBatchPermanentDeleteStorageItemsMutation,
  useBatchRestoreStorageItemsMutation,
  useDeleteStorageItemMutation,
  useGetStorageInfoQuery,
  useGetTrashItemsQuery,
  useRestoreTrashItemMutation,
} from "@/api/storageApi";
import { StorageBatchResponse, StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import { useI18n } from "@/shared/localization";
import MultiSelectBar from "@/shared/ui/MultiSelectBar";
import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import { StorageBreadcrumbs } from "@/widgets/storage/components/Path";
import { StorageItemList } from "@/widgets/storage/components/StorageItemList";
import { showStorageBatchResultAlert } from "@/widgets/storage/utils/storageBatchAlert";
import { useHierarchicalBrowser } from "@/widgets/storageList/hooks/useHierarchicalBrowser";
import {
  createStorageItemMenuItems,
  StorageItemMenuOptions,
} from "@/widgets/storageList/menu/storageItemMenu";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  View as RNView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const STORAGE_BATCH_MAX = 100;

const hasParentInTrash = (item: StorageItem, ids: Set<string>) =>
  !!(item.parentId && ids.has(item.parentId));

function mergeBatchResponses(parts: StorageBatchResponse[]): StorageBatchResponse {
  return parts.reduce(
    (acc, r) => ({
      total: acc.total + r.total,
      succeeded: acc.succeeded + r.succeeded,
      failed: acc.failed + r.failed,
      results: [...acc.results, ...r.results],
    }),
    {
      total: 0,
      succeeded: 0,
      failed: 0,
      results: [] as StorageBatchResponse["results"],
    }
  );
}

const TrashScreen = () => {
  const { tl } = useI18n();
  const { data: storageInfo } = useGetStorageInfoQuery();
  const storageId = storageInfo?.id || "";

  const { data: trashItems, isLoading, refetch } = useGetTrashItemsQuery(
    { storageId },
    { skip: !storageId }
  );

  const [restoreItem] = useRestoreTrashItemMutation();
  const [deletePermanently] = useDeleteStorageItemMutation();
  const [batchRestore] = useBatchRestoreStorageItemsMutation();
  const [batchPermanentDelete] = useBatchPermanentDeleteStorageItemsMutation();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const toggleSelection = useCallback((item: StorageItem) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  }, []);

  const resetSelection = useCallback(() => setSelectedIds(new Set()), []);

  const handleRestore = useCallback(async (item: StorageItem) => {
    if (!storageId) return;
    try {
      await restoreItem({
        storageId,
        itemId: item.id,
      }).unwrap();
      refetch();
      Alert.alert(tl("Успешно"), tl("Элемент восстановлен"));
    } catch {
      Alert.alert(tl("Ошибка"), tl("Не удалось восстановить элемент"));
    }
  }, [storageId, restoreItem, refetch]);

  const handleDeletePermanently = useCallback(async (item: StorageItem) => {
    if (!storageId) return;
    Alert.alert(
      tl("Удалить навсегда?"),
      tl("Это действие нельзя отменить"),
      [
        { text: tl("Отмена"), style: "cancel" },
        {
          text: tl("Удалить"),
          style: "destructive",
          onPress: async () => {
            try {
              await deletePermanently({
                storageId,
                itemId: item.id,
              }).unwrap();
              refetch();
              Alert.alert(tl("Успешно"), tl("Элемент удален навсегда"));
            } catch {
              Alert.alert(tl("Ошибка"), tl("Не удалось удалить элемент"));
            }
          },
        },
      ]
    );
  }, [storageId, deletePermanently, refetch, tl]);

  const ids = useMemo(() => new Set((trashItems ?? []).map((i) => i.id)), [trashItems]);
  const normalizedParentId = useCallback(
    (item: StorageItem) => (item.parentId && ids.has(item.parentId) ? item.parentId : null),
    [ids]
  );

  const childCountByParentId = useMemo(() => {
    const map = new Map<string, number>();
    for (const item of (trashItems ?? []) as any as StorageItem[]) {
      const pid = normalizedParentId(item);
      if (!pid) continue;
      map.set(pid, (map.get(pid) ?? 0) + 1);
    }
    return map;
  }, [trashItems, normalizedParentId]);

  const {
    path,
    visibleItems,
    openFolder,
    navigateTo,
  } = useHierarchicalBrowser<StorageItem>({
    items: (trashItems ?? []) as any as StorageItem[],
    rootLabel: tl("Корзина"),
    getParentId: (item, { ids }) =>
      item.parentId && ids.has(item.parentId) ? item.parentId : null,
  });

  const visibleItemsWithCounts = useMemo(() => {
    return visibleItems.map((item) => {
      if (!item.isDirectory) return item;
      return {
        ...item,
        childrenCount: childCountByParentId.get(item.id) ?? 0,
      };
    });
  }, [visibleItems, childCountByParentId]);

  const menuOptions: StorageItemMenuOptions = useMemo(
    () => ({
      folder: ["restore", "deletePermanent"],
      file: ["restore", "deletePermanent"],
    }),
    []
  );

  const getMenuItems = useCallback(
    (item: StorageItem, ctx: { isFavorite: boolean }) =>
      createStorageItemMenuItems(
        item,
        {
          ...ctx,
          canRestore: item.isDirectory ? !hasParentInTrash(item, ids) : true,
        },
        {
          onRestore: (i) => {
            if (i.isDirectory && hasParentInTrash(i, ids)) {
              Alert.alert(
                tl("Нельзя восстановить"),
                tl("Сначала восстановите родительскую папку из корзины.")
              );
              return;
            }
            handleRestore(i);
          },
          onDeletePermanent: handleDeletePermanently,
        },
        menuOptions
      ),
    [ids, menuOptions, handleDeletePermanently, handleRestore]
  );

  const runPermanentDeleteChunks = useCallback(
    async (itemIds: string[]) => {
      const parts: StorageBatchResponse[] = [];
      for (let i = 0; i < itemIds.length; i += STORAGE_BATCH_MAX) {
        const chunk = itemIds.slice(i, i + STORAGE_BATCH_MAX);
        const r = await batchPermanentDelete({ storageId, itemIds: chunk }).unwrap();
        parts.push(r);
      }
      return mergeBatchResponses(parts);
    },
    [batchPermanentDelete, storageId]
  );

  const handleClearEntireTrash = useCallback(() => {
    const allIds = (trashItems ?? []).map((i) => i.id);
    if (allIds.length === 0 || !storageId) return;
    Alert.alert(
      tl("Очистить корзину?"),
      tl(`Безвозвратно удалить все элементы (${allIds.length})?`),
      [
        { text: tl("Отмена"), style: "cancel" },
        {
          text: tl("Удалить всё"),
          style: "destructive",
          onPress: async () => {
            try {
              const merged = await runPermanentDeleteChunks(allIds);
              showStorageBatchResultAlert(merged, tl("Удаление"));
              resetSelection();
              refetch();
            } catch (e: unknown) {
              const err = e as { data?: { message?: string }; message?: string };
              Alert.alert(
                tl("Ошибка"),
                String(err?.data?.message ?? err?.message ?? tl("Запрос не выполнен"))
              );
            }
          },
        },
      ]
    );
  }, [trashItems, storageId, runPermanentDeleteChunks, resetSelection, refetch, tl]);

  const handleBatchRestore = useCallback(() => {
    const chosen = [...selectedIds];
    if (chosen.length === 0 || !storageId) return;
    const restorable = chosen.filter((id) => {
      const item = (trashItems ?? []).find((i) => i.id === id);
      if (!item) return false;
      if (!item.isDirectory) return true;
      return !hasParentInTrash(item, ids);
    });
    if (restorable.length === 0) {
      Alert.alert(
        tl("Нельзя восстановить"),
        tl("Для выбранных папок сначала восстановите родителя в корзине.")
      );
      return;
    }
    const skipped = chosen.length - restorable.length;
    const run = async () => {
      try {
        const parts: StorageBatchResponse[] = [];
        for (let i = 0; i < restorable.length; i += STORAGE_BATCH_MAX) {
          const chunk = restorable.slice(i, i + STORAGE_BATCH_MAX);
          const r = await batchRestore({ storageId, itemIds: chunk }).unwrap();
          parts.push(r);
        }
        const merged = mergeBatchResponses(parts);
        showStorageBatchResultAlert(
          merged,
          skipped > 0 ? `Восстановление (пропущено: ${skipped})` : tl("Восстановление")
        );
        resetSelection();
        refetch();
      } catch (e: unknown) {
        const err = e as { data?: { message?: string }; message?: string };
        Alert.alert(
          tl("Ошибка"),
          String(err?.data?.message ?? err?.message ?? tl("Запрос не выполнен"))
        );
      }
    };
    if (skipped > 0) {
      Alert.alert(
        tl("Восстановить доступные?"),
        tl(
          `Будут восстановлены ${restorable.length} из ${chosen.length} (остальные требуют родителя).`
        ),
        [
          { text: tl("Отмена"), style: "cancel" },
          { text: tl("Восстановить"), onPress: () => void run() },
        ]
      );
      return;
    }
    void run();
  }, [
    selectedIds,
    storageId,
    trashItems,
    ids,
    batchRestore,
    resetSelection,
    refetch,
  ]);

  const handleBatchPermanent = useCallback(() => {
    const chosen = [...selectedIds];
    if (chosen.length === 0 || !storageId) return;
    Alert.alert(
      tl("Удалить навсегда?"),
      tl(`Элементов: ${chosen.length}. Это действие нельзя отменить.`),
      [
        { text: tl("Отмена"), style: "cancel" },
        {
          text: tl("Удалить"),
          style: "destructive",
          onPress: async () => {
            try {
              const merged = await runPermanentDeleteChunks(chosen);
              showStorageBatchResultAlert(merged, tl("Удаление"));
              resetSelection();
              refetch();
            } catch (e: unknown) {
              const err = e as { data?: { message?: string }; message?: string };
              Alert.alert(
                tl("Ошибка"),
                String(err?.data?.message ?? err?.message ?? tl("Запрос не выполнен"))
              );
            }
          },
        },
      ]
    );
  }, [selectedIds, storageId, runPermanentDeleteChunks, resetSelection, refetch, tl]);

  const multiSelectMenuItems: ActionMenuItemData[] = useMemo(
    () => [
      {
        id: "batch-restore",
        icon: "rotate-ccw",
        label: tl("Восстановить"),
        disabled: selectedIds.size === 0,
        onPress: handleBatchRestore,
      },
      {
        id: "batch-perm",
        icon: "trash-2",
        label: tl("Удалить навсегда"),
        destructive: true,
        disabled: selectedIds.size === 0,
        onPress: handleBatchPermanent,
      },
      {
        id: "batch-cancel",
        icon: "x",
        label: tl("Отмена"),
        onPress: resetSelection,
      },
    ],
    [selectedIds.size, handleBatchRestore, handleBatchPermanent, resetSelection]
  );

  const multiSelectActive = selectedIds.size > 0;

  return (
    <View>
      <Header title={tl("Корзина")} />

      {isLoading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : (
        <>
          {multiSelectActive && (
            <MultiSelectBar
              selectedCount={selectedIds.size}
              menuItems={multiSelectMenuItems}
            />
          )}

          <RNView style={styles.headerRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.breadcrumbContainer}
            >
              <StorageBreadcrumbs path={path} onNavigate={navigateTo} />
            </ScrollView>
            {(trashItems?.length ?? 0) > 0 && (
              <TouchableOpacity
                onPress={handleClearEntireTrash}
                disabled={multiSelectActive}
                style={multiSelectActive ? styles.clearTrashBtnDisabled : undefined}
              >
                <ThemedText style={styles.clearTrashText}>{tl("Очистить всё")}</ThemedText>
              </TouchableOpacity>
            )}
          </RNView>

          <StorageItemList
            items={visibleItemsWithCounts}
            previewEnabled={false}
            previewUrls={{}}
            onFolderPress={openFolder}
            getMenuItems={getMenuItems}
            multiSelect={{
              active: selectedIds.size > 0,
              selectedIds,
              onToggle: toggleSelection,
            }}
            suppressMenus={multiSelectActive}
          />

          {(!trashItems || trashItems.length === 0) && (
            <RNView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>{tl("Корзина пуста")}</ThemedText>
            </RNView>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    gap: 8,
    paddingHorizontal: 4,
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    flexGrow: 1,
  },
  clearTrashText: {
    color: Colors.reject,
    fontSize: 14,
    fontWeight: "600",
  },
  clearTrashBtnDisabled: {
    opacity: 0.4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});

export default TrashScreen;
