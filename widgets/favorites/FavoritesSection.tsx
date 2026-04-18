import { useGetFavoritesQuery } from "@/api/favorites";
import { useGetStorageInfoQuery } from "@/api/storageApi";
import type { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { StorageSection } from "@/widgets/storage/components/StorageSection";
import {
  menuOptions,
} from "@/widgets/storage/components/StorageSection/data/defaultOptions";
import type {
  StorageItemMenuOption,
  StorageItemMenuOptions,
} from "@/widgets/storageList/menu/storageItemMenu";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { ActivityIndicator, View as RNView, StyleSheet } from "react-native";
type FavoritesSectionProps = {
  renderHeaderActions?: (params: {
    onOpenGlobalTags: () => void;
  }) => React.ReactNode;
};

/**
 * Вкладка «Избранное»: тот же {@link StorageSection}, что и в Storage, с виртуальным корнем из списка избранного.
 */
export function FavoritesSection({ renderHeaderActions }: FavoritesSectionProps) {
  const { data: favorites, isLoading: isFavoritesLoading } = useGetFavoritesQuery();
  const { data: storageInfo, isLoading: isStorageLoading } = useGetStorageInfoQuery();

  const storageId = storageInfo?.id ?? "";

  const initialItems = useMemo((): StorageItem[] => {
    const list = favorites?.items ?? [];
    return [...list]
      .filter((i) => !i.deletedAt)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [favorites?.items]);

  const menuOptionsAtVirtualRoot = useMemo<StorageItemMenuOptions>(() => {
    const base = menuOptions as {
      folder: StorageItemMenuOption[];
      file: StorageItemMenuOption[];
    };
    return {
      folder: base.folder.filter((k) => k !== "copy"),
      file: base.file.filter((k) => k !== "copy"),
    };
  }, []);

  const loading = isFavoritesLoading || isStorageLoading;

  if (loading) {
    return (
      <RNView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </RNView>
    );
  }

  if (!storageId) {
    return (
      <RNView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>Нет хранилища</ThemedText>
      </RNView>
    );
  }

  if (initialItems.length === 0) {
    return (
      <RNView style={styles.emptyContainer}>
        <Feather
          name="star"
          size={48}
          color={Colors.secondary}
          style={{ marginBottom: 12 }}
        />
        <ThemedText style={styles.emptyTitle}>Нет избранных элементов</ThemedText>
        <ThemedText style={styles.emptySubtext}>
          Добавьте элементы в избранное через меню в хранилище или Shared
        </ThemedText>
      </RNView>
    );
  }

  return (
    <StorageSection
      options={{
        showBreadcrumbs: true,
        showPreviewToggle: true,
        showFAB: false,
        showGlobalTagsButton: true,
        rootLabel: "Избранное",
        initialItems,
        favoritesBrowseMode: true,
        menuOptionsAtVirtualRoot,
        redirectMoveToStorageTab: true,
      }}
      menuOptions={menuOptions}
      renderHeaderActions={renderHeaderActions}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyTitle: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtext: {
    color: Colors.secondary,
    fontSize: 13,
    textAlign: "center",
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});
