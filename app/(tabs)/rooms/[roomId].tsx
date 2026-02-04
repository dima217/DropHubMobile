import { useGetRoomDetailsQuery } from "@/api/roomApi";
import { Colors } from "@/constants/design-tokens";
import { useRoomFilesUpdate } from "@/hooks/data/useRoomFilesUpdate";
import { secureStore } from "@/services/secureStore";
import Header from "@/shared/Header";
import UpdateFileModal from "@/shared/Modals/UpdateFileModal";
import UploadPreviewModal from "@/shared/Modals/UploadPreviewModal";
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
import { ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import RoomPlaceholder from "./room-placeholder";

const RoomDetailsScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

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
    () => new FileMenuManager(handleDownloadFiles, handleDeleteFiles, handleShareFiles,  
      (fileId: string, storedName: string) => {
      openEditFileModal(fileId, storedName);
    }),
    [handleDownloadFiles, handleDeleteFiles, handleShareFiles, openEditFileModal]
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
          } else {
            // TODO: Open file preview or perform default action
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
