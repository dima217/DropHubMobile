import {
  useDeleteStorageItemMutation,
  useGetStorageInfoQuery,
  useGetTrashItemsQuery,
  useRestoreTrashItemMutation,
} from "@/api/storageApi";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import { StorageBreadcrumbs } from "@/widgets/storage/components/Path";
import { StorageItemList } from "@/widgets/storage/components/StorageItemList";
import { useHierarchicalBrowser } from "@/widgets/storageList/hooks/useHierarchicalBrowser";
import {
  createStorageItemMenuItems,
  StorageItemMenuOptions,
} from "@/widgets/storageList/menu/storageItemMenu";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  View as RNView,
  ScrollView,
  StyleSheet,
} from "react-native";

const hasParentInTrash = (item: StorageItem, ids: Set<string>) =>
  !!(item.parentId && ids.has(item.parentId));

const TrashScreen = () => {
  const { data: storageInfo } = useGetStorageInfoQuery();
  const storageId = storageInfo?.id || "";

  const { data: trashItems, isLoading, refetch } = useGetTrashItemsQuery(
    { storageId },
    { skip: !storageId }
  );

  const [restoreItem] = useRestoreTrashItemMutation();
  const [deletePermanently] = useDeleteStorageItemMutation();

  const handleRestore = useCallback(async (item: StorageItem) => {
    if (!storageId) return;
    try {
      await restoreItem({
        storageId,
        itemId: item.id,
      }).unwrap();
      refetch();
      Alert.alert("Успешно", "Элемент восстановлен");
    } catch {
      Alert.alert("Ошибка", "Не удалось восстановить элемент");
    }
  }, [storageId, restoreItem, refetch]);

  const handleDeletePermanently = useCallback(async (item: StorageItem) => {
    if (!storageId) return;
    Alert.alert(
      "Удалить навсегда?",
      "Это действие нельзя отменить",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePermanently({
                storageId,
                itemId: item.id,
              }).unwrap();
              refetch();
              Alert.alert("Успешно", "Элемент удален навсегда");
            } catch {
              Alert.alert("Ошибка", "Не удалось удалить элемент");
            }
          },
        },
      ]
    );
  }, [storageId, deletePermanently, refetch]);

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
    rootLabel: "Корзина",
    // Orphans (parent not in trash list) should be shown at root.
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
                "Нельзя восстановить",
                "Сначала восстановите родительскую папку из корзины."
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

  return (
    <View>
      <Header title="Корзина" />

      {isLoading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : (
        <>
          <RNView style={styles.headerRow}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.breadcrumbContainer}
            >
              <StorageBreadcrumbs path={path} onNavigate={navigateTo} />
            </ScrollView>
          </RNView>

          <StorageItemList
            items={visibleItemsWithCounts}
            previewEnabled={false}
            previewUrls={{}}
            onFolderPress={openFolder}
            getMenuItems={getMenuItems}
          />

          {(!trashItems || trashItems.length === 0) && (
            <RNView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>Корзина пуста</ThemedText>
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
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
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

