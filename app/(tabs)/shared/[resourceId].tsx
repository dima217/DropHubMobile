import {
    useLazyDownloadSharedFileQuery,
} from "@/api/fileApi";
import {
    useCreateSharedItemMutation,
    useGetSharedResourcesQuery,
    useGetSharedStructureQuery,
} from "@/api/sharedApi";
import { AccessRole } from "@/api/types/room";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import Header from "@/shared/Header";
import CreateFolderModal from "@/shared/Modals/StorageModals/CreateFolderModal";
import ItemInfoModal from "@/shared/Modals/StorageModals/ItemInfoModal";
import PermissionsModal from "@/shared/Modals/StorageModals/PermissionsModal";
import UploadPreviewModal from "@/shared/Modals/UploadPreviewModal";
import View from "@/shared/View";
import PreviewToggleSwitch from "@/shared/ui/PreviewToggleSwitch";
import { useSharedFileUpload } from "@/widgets/shared/hooks/useSharedFileUpload";
import { StorageBreadcrumbs } from "@/widgets/storage/components/Path";
import { StorageFAB } from "@/widgets/storage/components/StorageFAB";
import { StorageItemList } from "@/widgets/storage/components/StorageItemList";
import { useStoragePreviewUrls } from "@/widgets/storage/hooks/useStoragePreviewUrls";
import { useFolderPathNavigation } from "@/widgets/storageList/hooks/useFolderPathNavigation";
import {
    createStorageItemMenuItems,
    StorageItemMenuOptions,
} from "@/widgets/storageList/menu/storageItemMenu";
import { skipToken } from "@reduxjs/toolkit/query";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    View as RNView,
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

const SharedResourceScreen = () => {
  const { resourceId, storageId } = useLocalSearchParams<{
    resourceId?: string;
    storageId?: string;
  }>();

  const [previewEnabled, setPreviewEnabled] = useState(false);
  const [permissionsVisible, setPermissionsVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StorageItem | null>(null);
  const [createFolderVisible, setCreateFolderVisible] = useState(false);

  const {
    currentParentId,
    path,
    openFolder,
    navigateTo,
  } = useFolderPathNavigation("Root");

  const { data: sharedResources } = useGetSharedResourcesQuery();
  const userRole = useMemo(() => {
    if (!sharedResources || !resourceId) return undefined;
    return sharedResources.find((r) => r.id === resourceId)?.userRole;
  }, [sharedResources, resourceId]);
  const canWrite = userRole === AccessRole.WRITE || userRole === AccessRole.ADMIN;

  const effectiveParentId = currentParentId ?? resourceId ?? null;

  const { data: structure, isLoading, isError, error, refetch } =
    useGetSharedStructureQuery(
      storageId && resourceId
        ? { storageId, resourceId, parentId: effectiveParentId ?? undefined }
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
    storageId || "",
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
    storageId || "",
    resourceId || "",
    (effectiveParentId || resourceId || "") as string,
    undefined
  );

  const [downloadSharedFile] = useLazyDownloadSharedFileQuery();

  const handleDownload = useCallback(
    async (item: StorageItem) => {
      // For shared downloads we must use sharedId (resourceId), not storageId.
      if (!resourceId || !item.fileId) return;
      try {
        const response = await downloadSharedFile({
          resourceId: resourceId,
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
    [downloadSharedFile, resourceId]
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
      if (!storageId || !resourceId) return;
      if (!canWrite) {
        Alert.alert("Нет прав", "У вас нет прав на создание элементов");
        return;
      }
      try {
        await createSharedItem({
          storageId,
          resourceId,
          name,
          parentId: effectiveParentId || resourceId,
          isDirectory: true,
        }).unwrap();
        refetch();
        Alert.alert("Успешно", "Папка создана");
      } catch (e) {
        console.log("Create shared folder failed", e);
        Alert.alert("Ошибка", "Не удалось создать папку");
      }
    },
    [storageId, resourceId, canWrite, createSharedItem, effectiveParentId, refetch]
  );

  if (!resourceId || !storageId) {
    return (
      <View>
        <Header title="Shared" />
        <RNView style={styles.center}>
          <Text style={styles.errorText}>
            Не хватает параметров для открытия ресурса (storageId/resourceId).
          </Text>
        </RNView>
      </View>
    );
  }

  if (isError) {
    return (
      <View>
        <Header title="Shared" />
        <RNView style={styles.center}>
          <Text style={styles.errorText}>
            {(error as any).data?.message}
          </Text>
        </RNView>
      </View>
    );
  }

  return (
    <View>
      <Header title="Shared" />

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
            <PreviewToggleSwitch
              isEnabled={previewEnabled}
              onToggle={setPreviewEnabled}
            />
          </RNView>

          <StorageItemList
            items={itemsInCurrentFolder}
            previewEnabled={previewEnabled}
            previewUrls={previewUrls}
            favoriteItemIds={undefined}
            onFolderPress={openFolder}
            getMenuItems={getMenuItems}
          />
        </>
      )}

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
          isStorageReady={!!storageId && !!resourceId}
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
  errorText: {
    color: Colors.reject,
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
});

export default SharedResourceScreen;


