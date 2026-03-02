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
import { useStoragePreviewUrls } from "@/widgets/storage/hooks/useStoragePreviewUrls";
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
  FlatList,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const SharedScreen = () => {
  const { data: sharedResources, isLoading } = useGetSharedResourcesQuery();
  const [downloadSharedFile] = useLazyDownloadSharedFileQuery();
  const [activeResource, setActiveResource] =
    useState<GetSharedResourcesResponse | null>(null);

  const handleItemPress = useCallback(
    async (item: GetSharedResourcesResponse) => {
      if (item.isDirectory) {
        setActiveResource(item);
        return;
      }

      if (!item.fileId) {
        Alert.alert("Ошибка", "У файла нет fileId");
        return;
      }

      try {
        const response = await downloadSharedFile({
          resourceId: item.id,
          fileIds: [item.fileId],
        }).unwrap();
        const uploader = createUploader(UploadProvider.MINIO);
        for (const { url } of response) {
          await uploader.download(url);
        }
        Alert.alert("Успешно", "Файл загружен");
      } catch (e) {
        console.log("Shared download failed", e);
        Alert.alert("Ошибка", "Не удалось скачать файл");
      }
    },
    [downloadSharedFile]
  );

  const headerRightAction = activeResource ? (
    <TouchableOpacity onPress={() => setActiveResource(null)}>
      <ThemedText style={styles.backText}>Назад</ThemedText>
    </TouchableOpacity>
  ) : (
    <SearchButton />
  );

  return (
    <View>
      <Header title="Shared" rightAction={headerRightAction} />

      {isLoading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : activeResource ? (
        <SharedResourceView
          resource={activeResource}
          onClose={() => setActiveResource(null)}
        />
      ) : (
        <FlatList
          data={sharedResources || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemCard}
              onPress={() => handleItemPress(item as GetSharedResourcesResponse)}
            >
              <ThemedText style={styles.itemTitle}>
                {item.isDirectory ? "Папка" : "Файл"}
              </ThemedText>
              <ThemedText style={styles.itemSubtitle}>
                ID: {item.id}
              </ThemedText>
              <ThemedText style={styles.itemRole}>
                Роль: {item.userRole}
              </ThemedText>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <RNView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                Нет общих ресурсов
              </ThemedText>
            </RNView>
          }
          contentContainerStyle={styles.listContent}
        />
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
  listContent: {
    paddingVertical: 12,
  },
  itemCard: {
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.brightText,
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 12,
    color: Colors.secondary,
    marginBottom: 4,
  },
  itemRole: {
    fontSize: 14,
    color: Colors.primary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 14,
  },
  backText: {
    color: Colors.primary,
    fontSize: 14,
  },
});

export default SharedScreen;

interface SharedResourceViewProps {
  resource: GetSharedResourcesResponse;
  onClose: () => void;
}

const SharedResourceView: React.FC<SharedResourceViewProps> = ({
  resource,
}) => {
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [permissionsVisible, setPermissionsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [createFolderVisible, setCreateFolderVisible] = useState(false);

  const { currentParentId, path, openFolder, navigateTo } =
    useFolderPathNavigation("Root");

  const canWrite =
    resource.userRole === AccessRole.WRITE ||
    resource.userRole === AccessRole.ADMIN;

  const effectiveParentId = currentParentId ?? resource.id ?? null;

  const { data: structure, isLoading, isError, error, refetch } =
    useGetSharedStructureQuery(
      resource.storageId && resource.id
        ? {
            storageId: resource.storageId,
            resourceId: resource.id,
            parentId: effectiveParentId ?? undefined,
          }
        : skipToken
    );

  const itemsInCurrentFolder = useMemo(() => {
    if (!structure) return [];
    return structure
      .filter((item) => item.parentId === effectiveParentId && !item.deletedAt)
      .sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [structure, effectiveParentId]);

  const previewUrls = useStoragePreviewUrls(
    resource.storageId || "",
    itemsInCurrentFolder,
    previewEnabled
  );

  const {
    uploadingFiles,
    isUploadPreviewModalVisible,
    pickFiles,
    uploadFiles,
    clearUploads,
  } = useSharedFileUpload(
    resource.storageId || "",
    resource.id || "",
    (effectiveParentId || resource.id || "") as string,
    undefined
  );

  const [downloadSharedFile] = useLazyDownloadSharedFileQuery();

  const handleDownload = useCallback(
    async (item: StorageItem) => {
      if (!resource.id || !item.fileId) return;
      try {
        const response = await downloadSharedFile({
          resourceId: resource.id,
          fileIds: [item.fileId],
        }).unwrap();
        const uploader = createUploader(UploadProvider.MINIO);
        for (const { url } of response) {
          await uploader.download(url);
        }
        Alert.alert("Успешно", "Файл загружен");
      } catch (e) {
        console.log("Shared download failed", e);
        Alert.alert("Ошибка", "Не удалось скачать файл");
      }
    },
    [downloadSharedFile, resource.id]
  );

  const menuOptions: StorageItemMenuOptions = useMemo(
    () => ({
      folder: ["permissions", "info"],
      file: ["download", "permissions", "info"],
    }),
    []
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
    [handleDownload, menuOptions]
  );

  const [createSharedItem, { isLoading: isCreating }] =
    useCreateSharedItemMutation();

  const handleCreateFolder = useCallback(
    async (name: string) => {
      if (!resource.storageId || !resource.id) return;
      if (!canWrite) {
        Alert.alert("Нет прав", "У вас нет прав на создание элементов");
        return;
      }
      try {
        await createSharedItem({
          storageId: resource.storageId,
          resourceId: resource.id,
          name,
          parentId: effectiveParentId || resource.id,
          isDirectory: true,
        }).unwrap();
        refetch();
        Alert.alert("Успешно", "Папка создана");
      } catch (e) {
        console.log("Create shared folder failed", e);
        Alert.alert("Ошибка", "Не удалось создать папку");
      }
    },
    [resource.storageId, resource.id, canWrite, createSharedItem, effectiveParentId, refetch]
  );

  if (isError) {
    return (
      <RNView style={styles.center}>
        <ThemedText style={styles.emptyText}>
          {(error as any)?.data?.message || "Ошибка загрузки общего ресурса"}
        </ThemedText>
      </RNView>
    );
  }

  return (
    <>
      {isLoading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : (
        <StorageSection
          options={{
            showBreadcrumbs: true,
            showPreviewToggle: true,
            showFAB: false,
            showGlobalTagsButton: false,
            rootLabel: "Root",
          }}
          menuOptions={menuOptions}
          getMenuItems={getMenuItems}
          externalData={{
            items: itemsInCurrentFolder,
            path,
            onFolderPress: openFolder,
            onNavigate: navigateTo,
          }}
        />
      )}

      <PermissionsModal
        visible={permissionsVisible}
        itemId={selectedItem?.id || ""}
        storageId={resource.storageId}
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

      <CreateFolderModal
        visible={createFolderVisible}
        onClose={() => setCreateFolderVisible(false)}
        onConfirm={handleCreateFolder}
      />

      {canWrite && (
        <StorageFAB
          onCreateFolder={() => setCreateFolderVisible(true)}
          onUploadFiles={pickFiles}
          isCreatingFolder={isCreating}
          isStorageReady={!!resource.storageId && !!resource.id}
        />
      )}

      <UploadPreviewModal
        visible={isUploadPreviewModalVisible}
        files={uploadingFiles}
        onClose={clearUploads}
        onUpload={async (files) => {
          await uploadFiles(files as any);
          refetch();
        }}
      />
    </>
  );
};

