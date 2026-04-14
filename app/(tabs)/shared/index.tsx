import { useLazyDownloadSharedFileQuery } from "@/api/fileApi";
import {
  useCreateSharedItemMutation,
  useGetSharedResourcesQuery,
  useGetSharedStructureQuery,
} from "@/api/sharedApi";
import { AccessRole } from "@/api/types/room";
import { GetSharedResourcesResponse } from "@/api/types/shared";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { useAutoMarkSharedNotificationsRead } from "@/hooks/data/useAutoMarkNotificationsOnView";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import { ThemedText } from "@/shared/core/ThemedText";
import Header from "@/shared/Header";
import CreateFolderModal from "@/shared/Modals/StorageModals/CreateFolderModal";
import ItemInfoModal from "@/shared/Modals/StorageModals/ItemInfoModal";
import PermissionsModal from "@/shared/Modals/StorageModals/PermissionsModal";
import UploadPreviewModal from "@/shared/Modals/UploadPreviewModal";
import SearchButton from "@/shared/SearchButton";
import View from "@/shared/View";
import { useSharedFileUpload } from "@/widgets/shared/hooks/useSharedFileUpload";
import { StorageFAB } from "@/widgets/storage/components/StorageFAB";
import { StorageSection } from "@/widgets/storage/components/StorageSection";
import { useFolderPathNavigation } from "@/widgets/storageList/hooks/useFolderPathNavigation";
import {
  createStorageItemMenuItems,
  StorageItemMenuOptions,
} from "@/widgets/storageList/menu/storageItemMenu";
import { skipToken } from "@reduxjs/toolkit/query";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  View as RNView,
  StyleSheet,
} from "react-native";

const menuOptions: StorageItemMenuOptions = {
  folder: ["permissions", "info"],
  file: ["download", "permissions", "info"],
};

const SharedScreen = () => {
  useAutoMarkSharedNotificationsRead();
  const { data: sharedResources, isLoading } = useGetSharedResourcesQuery();
  const [downloadSharedFile] = useLazyDownloadSharedFileQuery();
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [permissionsVisible, setPermissionsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);

  const { currentParentId, path, openFolder, navigateTo } =
    useFolderPathNavigation("Shared");

  const storageId = sharedResources?.[0]?.storageId ?? "";
  const rootResourceId = path[1]?.id ?? currentParentId ?? "";
  const currentResource =
    sharedResources?.find((r) => r.id === rootResourceId) ??
    sharedResources?.find((r) => r.isDirectory) ??
    sharedResources?.[0];
  const canWrite =
    currentResource?.userRole === AccessRole.WRITE ||
    currentResource?.userRole === AccessRole.ADMIN;

  const effectiveParentId = currentParentId ?? currentResource?.id ?? "";
  const { data: structure, isLoading: isStructureLoading, refetch } =
    useGetSharedStructureQuery(
      storageId && currentParentId && rootResourceId
        ? {
            storageId,
            resourceId: rootResourceId,
            parentId: currentParentId,
          }
        : skipToken
    );

  const {
    uploadingFiles,
    isUploadPreviewModalVisible,
    pickFiles,
    uploadFiles,
    clearUploads,
  } = useSharedFileUpload(
    storageId,
    rootResourceId || currentResource?.id || "",
    effectiveParentId,
    undefined
  );

  const [createSharedItem, { isLoading: isCreating }] =
    useCreateSharedItemMutation();

  const handleCreateFolder = useCallback(
    async (name: string) => {
      if (!storageId || !currentResource?.id) return;
      if (!canWrite) {
        Alert.alert("Нет прав", "У вас нет прав на создание элементов");
        return;
      }
      try {
        await createSharedItem({
          storageId,
          resourceId: currentResource.id,
          name,
          parentId: effectiveParentId || currentResource.id,
          isDirectory: true,
        }).unwrap();
        refetch();
        Alert.alert("Успешно", "Папка создана");
      } catch (e) {
        Alert.alert("Ошибка", "Не удалось создать папку");
      }
    },
    [storageId, currentResource, canWrite, createSharedItem, effectiveParentId, refetch]
  );

  const [createFolderVisible, setCreateFolderVisible] = useState(false);

  const items = useMemo(() => {
    if (currentParentId === null) {
      return (sharedResources ?? [])
        .filter((i) => !i.deletedAt)
        .sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });
    }
    return (structure ?? [])
      .filter((i) => !i.deletedAt)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [currentParentId, sharedResources, structure]);

  const handleDownload = useCallback(
    async (item: StorageItem) => {
      const res =
        sharedResources?.find((r) => r.id === item.parentId) ??
        sharedResources?.find((r) => r.isDirectory) ??
        sharedResources?.[0];
      if (!res?.id || !item.fileId) return;
      try {
        const response = await downloadSharedFile({
          resourceId: res.id,
          fileIds: [item.fileId],
        }).unwrap();
        const uploader = createUploader(UploadProvider.MINIO);
        for (const { url } of response) {
          await uploader.download(url);
        }
        Alert.alert("Успешно", "Файл загружен");
      } catch (e) {
        Alert.alert("Ошибка", "Не удалось скачать файл");
      }
    },
    [downloadSharedFile, sharedResources]
  );

  const getMenuItems = useCallback(
    (item: StorageItem, ctx: { isFavorite: boolean }) =>
      createStorageItemMenuItems(
        item,
        ctx,
        {
          onDownload: handleDownload,
          onViewPermissions: (i) => {
            setSelectedItem(i);
            setPermissionsVisible(true);
          },
          onInfo: (i) => {
            setSelectedItem(i);
            setInfoVisible(true);
          },
        },
        menuOptions
      ),
    [handleDownload]
  );

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

  return (
    <View>
      <Header title="Shared" rightAction={<SearchButton />} />

      {loading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : !sharedResources?.length ? (
        <RNView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>Нет общих ресурсов</ThemedText>
        </RNView>
      ) : (
        <>
          <StorageSection
            options={{
              showBreadcrumbs: true,
              showPreviewToggle: true,
              showFAB: false,
              showGlobalTagsButton: false,
              rootLabel: "Shared",
            }}
            menuOptions={menuOptions}
            getMenuItems={getMenuItems}
            externalData={{
              items,
              path,
              onFolderPress: openFolder,
              onNavigate: navigateTo,
            }}
            showAuthorship
            getItemAuthor={getItemAuthor}
          />

          <PermissionsModal
            visible={permissionsVisible}
            itemId={selectedItem?.id || ""}
            storageId={storageId}
            onClose={() => {
              setPermissionsVisible(false);
              setSelectedItem(null);
            }}
          />

          <ItemInfoModal
            visible={infoVisible}
            item={selectedItem}
            onClose={() => {
              setInfoVisible(false);
              setSelectedItem(null);
            }}
          />

          {canWrite && currentParentId !== null && (
            <StorageFAB
              onCreateFolder={() => setCreateFolderVisible(true)}
              onUploadFiles={pickFiles}
              isCreatingFolder={isCreating}
              isStorageReady={!!storageId && !!currentResource?.id}
            />
          )}

          <CreateFolderModal
            visible={createFolderVisible}
            onClose={() => setCreateFolderVisible(false)}
            onConfirm={handleCreateFolder}
          />

          <UploadPreviewModal
            visible={isUploadPreviewModalVisible}
            files={uploadingFiles}
            onClose={clearUploads}
            onUpload={async (files) => {
              await uploadFiles(files);
              refetch();
            }}
          />
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
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 14,
  },
});

export default SharedScreen;

