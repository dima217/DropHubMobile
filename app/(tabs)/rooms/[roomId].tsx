import { useConvertRoomFileMutation } from "@/api/fileApi";
import { useGetRoomDetailsQuery } from "@/api/roomApi";
import type { FileConversionType } from "@/api/types/file";
import { Colors } from "@/constants/design-tokens";
import { useRoomFilesUpdate } from "@/hooks/data/useRoomFilesUpdate";
import { secureStore } from "@/services/secureStore";
import Header from "@/shared/Header";
import ConversionPickerModal from "@/shared/Modals/ConversionPickerModal";
import UpdateFileModal from "@/shared/Modals/UpdateFileModal";
import UploadPreviewModal from "@/shared/Modals/UploadPreviewModal";
import { getConversionOptions } from "@/shared/fileConversion/getConversionOptions";
import SearchInput from "@/shared/SearchInput";
import MultiSelectBar from "@/shared/ui/MultiSelectBar";
import View from "@/shared/View";
import { RootState } from "@/store/store";
import ResourcesSection, { ResourceItem } from "@/widgets/rooms/components/ResourcesSection";
import { useEditFileModal } from "@/widgets/rooms/hooks/useEditFileModal";
import { useRoomFileManipulations } from "@/widgets/rooms/hooks/useRoomFileManipulation";
import { useRoomFileUpload } from "@/widgets/rooms/hooks/useRoomFileUpload";
import { combineRoomResources } from "@/widgets/rooms/mappers/roomResources.mapper";
import { FileMenuManager } from "@/widgets/rooms/menu/fileMenu";
import { folderMenuItems } from "@/widgets/rooms/menu/folderMenu";
import { createMultiSelectMenuItems } from "@/widgets/rooms/menu/multiSelectorMenu";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import RoomPlaceholder from "./room-placeholder";

const RoomDetailsScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [convertTarget, setConvertTarget] = useState<{
    fileId: string;
    storedName: string;
    mimeType: string;
  } | null>(null);
  const [convertSubmitting, setConvertSubmitting] = useState(false);
  const [convertRoomFile] = useConvertRoomFileMutation();
  const insets = useSafeAreaInsets();

  const roomConversionOptions = useMemo(
    () =>
      convertTarget
        ? getConversionOptions(convertTarget.mimeType, convertTarget.storedName)
        : [],
    [convertTarget]
  );

  const handleRoomConvertSelect = useCallback(
    async (conversion: FileConversionType) => {
      if (!roomId || !convertTarget) return;
      setConvertSubmitting(true);
      try {
        const result = await convertRoomFile({
          roomId,
          fileId: convertTarget.fileId,
          conversion,
        }).unwrap();
        const n = result.createdFiles?.length ?? 0;
        Alert.alert(
          "Готово",
          n > 1 ? `Создано файлов: ${n}` : "Файл сконвертирован и сохранён"
        );
        setConvertTarget(null);
      } catch (e: unknown) {
        const err = e as { data?: { message?: string }; message?: string };
        Alert.alert(
          "Ошибка",
          String(
            err?.data?.message ?? err?.message ?? "Не удалось конвертировать"
          )
        );
      } finally {
        setConvertSubmitting(false);
      }
    },
    [roomId, convertTarget, convertRoomFile]
  );

  const { data: roomDetails, isLoading, refetch } = useGetRoomDetailsQuery(roomId || "", {
    skip: !roomId,
  });

  React.useEffect(() => {
    secureStore.getAccessToken().then(setAccessToken);
  }, []);

  const {
    uploadingFiles,
    pickFiles,
    uploadFiles,
    isUploadPreviewModalVisible,
    setIsUploadPreviewModalVisible,
    clearUploads,
  } = useRoomFileUpload(roomId || '', user?.id ? parseInt(user.id) : undefined);

  const {
    selectedIds,
    isMultiSelectMode,
    resetSelection,
    toggleSelection,
    handleDownloadFiles,
    handleShareFiles,
    handleDeleteFiles,
  } = useRoomFileManipulations(roomId || '', refetch);

  const {
    isEditModalVisible,
    editingFileId,
    newFileName,
    openEditFileModal,
    saveFileName,
    cancelEdit,
  } = useEditFileModal(roomId || '');
  

  useRoomFilesUpdate(
    roomId || '',
    accessToken || '',
    useCallback(() => {
      refetch();
    }, [refetch]),
    !!roomId && !!accessToken
  );

  const fileMenuManager = useMemo(
    () =>
      new FileMenuManager(
        handleDownloadFiles,
        handleDeleteFiles,
        handleShareFiles,
        (fileId: string, storedName: string) => {
          openEditFileModal(fileId, storedName);
        },
        (fileId, storedName, mimeType) =>
          setConvertTarget({ fileId, storedName, mimeType })
      ),
    [
      handleDownloadFiles,
      handleDeleteFiles,
      handleShareFiles,
      openEditFileModal,
    ]
  );

  const multiSelectMenuItems = useMemo(
    () =>
      createMultiSelectMenuItems(
        selectedIds,
        handleDownloadFiles,
        handleDeleteFiles,
        resetSelection
      ),
    [selectedIds, handleDownloadFiles, handleDeleteFiles, resetSelection]
  );

  const handleUpdateFile = useCallback((fileId: string, storedName: string) => {
    saveFileName(storedName);
  }, [saveFileName]);

  const resources: ResourceItem[] = useMemo(() => {
    const allResources = combineRoomResources(uploadingFiles, roomDetails, user);
    if (!searchQuery.trim()) return allResources;
    const query = searchQuery.toLowerCase();
    return allResources.filter((item) => item.file?.storedName?.toLowerCase().includes(query));
  }, [roomDetails, uploadingFiles, user, searchQuery]);

  const handleNavigateToChat = useCallback(() => {
    if (roomId) router.push(`/(tabs)/rooms/${roomId}/chat`);
  }, [roomId, router]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Room Details" />
        <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (!roomDetails?.participantsDetails) {
    return (
      <View style={styles.container}>
        <Header title="Room Not Found" />
      </View>
    );
  }

  const hasFiles = (roomDetails.files && roomDetails.files.length > 0) || uploadingFiles.length > 0;

  if (!hasFiles) {
    return <RoomPlaceholder onAddFiles={pickFiles} />;
  }

  return (
    <View style={styles.container}>
      {isMultiSelectMode ? (
        <MultiSelectBar selectedCount={selectedIds.size} menuItems={multiSelectMenuItems} />
      ) : (
        <Header
          title="Room Details"
          rightAction={
            <TouchableOpacity onPress={handleNavigateToChat} style={styles.chatButton} activeOpacity={0.7}>
              <Feather name="message-circle" size={22} color={Colors.primary} />
            </TouchableOpacity>
          }
        />
      )}

      <SearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search files" />

      <ResourcesSection
        resources={resources}
        showAuthorship
        fileMenuItems={fileMenuManager}
        folderMenuItems={folderMenuItems}
        onFilePress={(file) => {
          if (isMultiSelectMode) {
            toggleSelection(file._id);
          }
        }}
        onFileLongPress={(file) => toggleSelection(file._id)}
        onFolderPress={(folderId) => toggleSelection(folderId)}
        onFolderLongPress={(folderId) => toggleSelection(folderId)}
        selectedIds={selectedIds}
        onSelectionChange={() => {}}
        isMultiSelectMode={isMultiSelectMode}
      />

      <TouchableOpacity
        style={[styles.uploadButton, { bottom: insets.bottom + 16 }]}
        onPress={pickFiles}
        activeOpacity={0.8}
      >
        <Feather name="upload" size={24} color={Colors.brightText} />
      </TouchableOpacity>

      <UploadPreviewModal
        visible={isUploadPreviewModalVisible}
        files={uploadingFiles}
        onClose={() => {
          clearUploads();
          setIsUploadPreviewModalVisible(false);
        }}
        onUpload={uploadFiles}
      />
      <UpdateFileModal
        visible={isEditModalVisible}
        fileId={editingFileId || ""}
        storedName={newFileName || ""}
        onClose={cancelEdit}
        onUpdate={handleUpdateFile}
      />

      <ConversionPickerModal
        visible={convertTarget !== null}
        fileName={convertTarget?.storedName ?? ""}
        options={roomConversionOptions}
        isSubmitting={convertSubmitting}
        onClose={() => !convertSubmitting && setConvertTarget(null)}
        onSelect={handleRoomConvertSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { marginTop: 50 },
  uploadButton: {
    position: 'absolute',
    right: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatButton: { padding: 4, justifyContent: 'center', alignItems: 'center' },
});

export default RoomDetailsScreen;
