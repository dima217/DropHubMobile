import { useGetSharedResourcesQuery, useGetSharedStructureQuery } from "@/api/sharedApi";
import { useGetStorageInfoQuery } from "@/api/storageApi";
import { AccessRole } from "@/api/types/room";
import { GetSharedResourcesResponse } from "@/api/types/shared";
import type { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { useAutoMarkSharedNotificationsRead } from "@/hooks/data/useAutoMarkNotificationsOnView";
import { ThemedText } from "@/shared/core/ThemedText";
import { StorageSection } from "@/widgets/storage/components/StorageSection";
import { useFolderPathNavigation } from "@/widgets/storageList/hooks/useFolderPathNavigation";
import type { StorageItemMenuOptions } from "@/widgets/storageList/menu/storageItemMenu";
import { consumePendingOpenFromFavorites } from "@/widgets/shared/pendingOpenFromFavorites";
import { useFocusEffect } from "@react-navigation/native";
import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, View as RNView, StyleSheet } from "react-native";

/**
 * Вкладка Shared: данные и навигация; модалки и действия — внутри {@link StorageSection} (`sharedContext`).
 */
export function SharedSection() {
  useAutoMarkSharedNotificationsRead();

  const {
    data: sharedResources,
    isLoading,
    refetch: refetchSharedResources,
  } = useGetSharedResourcesQuery();

  const { currentParentId, path, openFolder, navigateTo } =
    useFolderPathNavigation("Shared");

  useFocusEffect(
    useCallback(() => {
      const pending = consumePendingOpenFromFavorites();
      if (!pending) return;
      openFolder(pending);
    }, [openFolder])
  );

  const storageId = sharedResources?.[0]?.storageId ?? "";
  /** Корень дерева в breadcrumbs (`path[1]`) или текущая папка — как в запросе структуры */
  const structureTreeResourceId = path[1]?.id ?? currentParentId ?? "";

  const currentResource =
    sharedResources?.find((r) => r.id === structureTreeResourceId) ??
    sharedResources?.find((r) => r.isDirectory) ??
    sharedResources?.[0];

  /** `resourceId` для unified `/storage/*` (на корне списка шаров — выбранный ресурс) */
  const sharedApiResourceId =
    structureTreeResourceId || currentResource?.id || "";

  const canWrite =
    currentResource?.userRole === AccessRole.WRITE ||
    currentResource?.userRole === AccessRole.ADMIN;
  const canManagePermissions = currentResource?.userRole === AccessRole.ADMIN;

  const effectiveParentId = currentParentId ?? currentResource?.id ?? null;

  const { data: storageQuotaInfo } = useGetStorageInfoQuery(undefined, {
    skip: !storageId,
  });

  const { data: structure, isLoading: isStructureLoading, refetch } =
    useGetSharedStructureQuery(
      storageId && currentParentId && structureTreeResourceId
        ? {
            storageId,
            resourceId: structureTreeResourceId,
            parentId: currentParentId,
          }
        : skipToken
    );

  const refetchStructure = useCallback(() => {
    // Root list is powered by sharedResources, nested levels by structure.
    void refetchSharedResources();
    try {
      void refetch();
    } catch {
      // Structure query can be skipped on Shared root.
    }
  }, [refetchSharedResources, refetch]);

  const items = useMemo(() => {
    const sort = (a: StorageItem, b: StorageItem) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    };
    if (currentParentId === null) {
      return (sharedResources ?? [])
        .filter((i) => i.parentId === null && !i.deletedAt)
        .sort(sort);
    }
    return (structure ?? [])
      .filter((i) => i.parentId === currentParentId && !i.deletedAt)
      .sort(sort);
  }, [currentParentId, sharedResources, structure]);

  const menuOptions = useMemo<StorageItemMenuOptions>(() => {
    if (currentParentId === null) {
      return {
        folder: ["favorite", "info"],
        file: ["favorite", "info"],
      };
    }
    if (!canWrite) {
      return {
        folder: ["info"],
        file: ["download", "info"],
      };
    }
    if (canManagePermissions) {
      return {
        folder: [
          "rename",
          "copy",
          "move",
          "favorite",
          "share",
          "permissions",
          "info",
          "delete",
        ],
        file: [
          "download",
          "convert",
          "rename",
          "copy",
          "move",
          "favorite",
          "share",
          "permissions",
          "info",
          "delete",
        ],
      };
    }
    return {
      folder: ["rename", "copy", "move", "favorite", "info", "delete"],
      file: [
        "download",
        "convert",
        "rename",
        "copy",
        "move",
        "favorite",
        "info",
        "delete",
      ],
    };
  }, [currentParentId, canWrite, canManagePermissions]);

  const getItemAuthor = useCallback((item: StorageItem) => {
    const res = item as GetSharedResourcesResponse;
    return res.creator
      ? {
          avatarUrl: res.creator.profile.avatarUrl,
          firstName: res.creator.profile.firstName,
          userId: res.creator.id,
        }
      : null;
  }, []);

  const loading = isLoading || (currentParentId !== null && isStructureLoading);

  const sharedContext = useMemo(() => {
    if (!storageId || !sharedApiResourceId) return undefined;
    return {
      storageId,
      resourceId: sharedApiResourceId,
      refetchStructure,
      quota:
        storageQuotaInfo && storageQuotaInfo.maxBytes > 0
          ? {
              usedBytes: storageQuotaInfo.usedBytes ?? 0,
              maxBytes: storageQuotaInfo.maxBytes,
            }
          : null,
      canManagePermissions,
      fabVisible: canWrite && currentParentId !== null,
    };
  }, [
    storageId,
    sharedApiResourceId,
    refetchStructure,
    storageQuotaInfo,
    canManagePermissions,
    canWrite,
    currentParentId,
  ]);

  if (loading) {
    return (
      <RNView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </RNView>
    );
  }

  if (!sharedResources?.length) {
    return (
      <RNView style={styles.emptyContainer}>
        <ThemedText style={styles.emptyText}>Нет общих ресурсов</ThemedText>
      </RNView>
    );
  }

  return (
    <StorageSection
      options={{
        showBreadcrumbs: true,
        showPreviewToggle: true,
        showFAB: false,
        showGlobalTagsButton: false,
        rootLabel: "Shared",
        /** В корне списка шаров — только одиночные действия; внутри папки — как в хранилище. */
        enableMultiSelect: currentParentId !== null,
      }}
      menuOptions={menuOptions}
      externalData={{
        items,
        path,
        onFolderPress: openFolder,
        onNavigate: navigateTo,
        currentParentId,
        effectiveParentId,
      }}
      sharedContext={sharedContext}
      showAuthorship
      getItemAuthor={getItemAuthor}
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
  emptyText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});
