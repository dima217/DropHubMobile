import { useDeleteRoomFilesMutation, useLazyDownloadRoomFilesQuery } from "@/api/fileApi";
import { useGetRoomDetailsQuery } from "@/api/roomApi";
import { Colors } from "@/constants/design-tokens";
import { useRoomFilesUpdate } from "@/hooks/data/useRoomFilesUpdate";
import { secureStore } from "@/services/secureStore";
import { createUploader, UploadProvider } from "@/services/upload/UploaderFactory";
import Header from "@/shared/Header";
import SearchInput from "@/shared/SearchInput";
import MultiSelectBar from "@/shared/ui/MultiSelectBar";
import View from "@/shared/View";
import { RootState } from "@/store/store";
import ResourcesSection, { ResourceItem } from "@/widgets/rooms/components/ResourcesSection";
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();
  
  const { data: roomDetails, isLoading, refetch } = useGetRoomDetailsQuery(roomId || "", {
    skip: !roomId,
  });

  React.useEffect(() => {
    secureStore.getAccessToken().then(setAccessToken);
  }, []);

  const { uploadingFiles, pickAndUpload, isUploadPreviewModalVisible, setIsUploadPreviewModalVisible } = useRoomFileUpload(
    roomId || '',
    user?.id ? parseInt(user.id) : undefined
  );

  useRoomFilesUpdate(
    roomId || '',
    accessToken || '',
    useCallback(() => {
      refetch();
    }, [refetch]),
    !!roomId && !!accessToken
  );

  const [deleteRoomFiles] = useDeleteRoomFilesMutation();
  const [downloadRoomFiles] = useLazyDownloadRoomFilesQuery();

  const handleDownloadFiles = useCallback(async (fileIds: string[]) => {
    if (!roomId) return;
    
    try {
      const downloadResponse = await downloadRoomFiles({ fileIds, roomId }).unwrap();

      const downloadData: { fileId: string; url: string }[] = downloadResponse.map((response) => ({
        fileId: response.fileId,
        url: response.url,
      }));
      
      const uploader = createUploader(UploadProvider.MINIO);
      
      for (const item of downloadData) {
        try {
          await uploader.download(item.url, (progress) => {
            console.log(`Download progress for ${item.fileId}: ${progress.percentage}%`);
          });
          Alert.alert('Success', `File ${item.fileId} downloaded successfully`);
        } catch (downloadError) {
          console.error(`Failed to download ${item.fileId}:`, downloadError);
          Alert.alert('Error', `Failed to download file ${item.fileId}`);
        }
      }
    } catch (downloadError) {
      console.error('Download error:', downloadError);
      Alert.alert('Error', 'Failed to download files');
    }
  }, [downloadRoomFiles, roomId]);

  const handleShareFiles = useCallback(async (fileIds: string[]) => {
    if (!roomId) return;
    
    const downloadResponse = await downloadRoomFiles({ fileIds, roomId }).unwrap();

      const downloadData: { fileId: string; url: string }[] = downloadResponse.map((response) => ({
        fileId: response.fileId,
        url: response.url,
      }));
    try {
      const uploader = createUploader(UploadProvider.MINIO);
      for (const item of downloadData) {
        await uploader.share(item.url);
      }
    } catch (shareError) {
      console.error('Share error:', shareError);
      Alert.alert('Error', 'Failed to share files');
    }
  }, [downloadRoomFiles, roomId]);

  const handleDeleteFiles = useCallback(async (fileIds: string[]) => {
    if (!roomId) return;
    
    try {
      await deleteRoomFiles({ fileIds, roomId }).unwrap();
      refetch();
      setSelectedIds(new Set());
      setIsMultiSelectMode(false);
    } catch {
      Alert.alert('Error', 'Failed to delete files');
    }
  }, [roomId, deleteRoomFiles, refetch]);


  const fileMenuManager = useMemo(() => new FileMenuManager(handleDownloadFiles, handleDeleteFiles, handleShareFiles), [handleDownloadFiles, handleDeleteFiles, handleShareFiles]);

  const multiSelectMenuItems = useMemo(
    () =>
      createMultiSelectMenuItems(
        selectedIds,
        handleDownloadFiles,
        handleDeleteFiles,
        () => {
          setSelectedIds(new Set());
          setIsMultiSelectMode(false);
        }
      ),
    [selectedIds, handleDownloadFiles, handleDeleteFiles]
  );

  const resources: ResourceItem[] = useMemo(() => {
    const allResources = combineRoomResources(uploadingFiles, roomDetails, user);
  
    if (!searchQuery.trim()) return allResources;
  
    const query = searchQuery.toLowerCase();
  
    return allResources.filter((item) =>
      item.file?.originalName?.toLowerCase().includes(query)
    );
  }, [roomDetails, uploadingFiles, user, searchQuery]);
  

  const handleFileLongPress = useCallback((fileId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(fileId)) {
      newSelected.delete(fileId);
    } else {
      newSelected.add(fileId);
    }
    setSelectedIds(newSelected);
    if (newSelected.size > 0 && !isMultiSelectMode) {
      setIsMultiSelectMode(true);
    } else if (newSelected.size === 0 && isMultiSelectMode) {
      setIsMultiSelectMode(false);
    }
  }, [selectedIds, isMultiSelectMode]);

  const handleFolderLongPress = useCallback((folderId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(folderId)) {
      newSelected.delete(folderId);
    } else {
      newSelected.add(folderId);
    }
    setSelectedIds(newSelected);
    if (newSelected.size > 0 && !isMultiSelectMode) {
      setIsMultiSelectMode(true);
    } else if (newSelected.size === 0 && isMultiSelectMode) {
      setIsMultiSelectMode(false);
    }
  }, [selectedIds, isMultiSelectMode]);

  const handleNavigateToChat = useCallback(() => {
    if (roomId) {
      router.push(`/(tabs)/rooms/${roomId}/chat`);
    }
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
    return (
      <RoomPlaceholder 
        onAddFiles={pickAndUpload}
      />
    );
  }

  return (
    <View style={styles.container}>
      {isMultiSelectMode ? (
        <MultiSelectBar
          selectedCount={selectedIds.size}
          menuItems={multiSelectMenuItems}
        />
      ) : (
        <Header
          title="Room Details"
          rightAction={
            <TouchableOpacity
              onPress={handleNavigateToChat}
              style={styles.chatButton}
              activeOpacity={0.7}
            >
              <Feather name="message-circle" size={22} color={Colors.primary} />
            </TouchableOpacity>
          }
        />
      )}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
      />
      <ResourcesSection
        resources={resources}
        showAuthorship={true}
        fileMenuItems={fileMenuManager}
        folderMenuItems={folderMenuItems}
        onFilePress={(file) => {
          if (isMultiSelectMode) {
            if (selectedIds.has(file._id)) {
              // If already selected, deselect on press
              const newSelected = new Set(selectedIds);
              newSelected.delete(file._id);
              setSelectedIds(newSelected);
              if (newSelected.size === 0) {
                setIsMultiSelectMode(false);
              }
            } else {
              // If not selected, select it
              const newSelected = new Set(selectedIds);
              newSelected.add(file._id);
              setSelectedIds(newSelected);
            }
          } else {
            // Normal press - open file preview or do default action
            // TODO: Open file preview
          }
        }}
        onFileLongPress={(file) => handleFileLongPress(file._id)}
        onFolderPress={(folderId) => {
          if (isMultiSelectMode) {
            if (selectedIds.has(folderId)) {
              // If already selected, deselect on press
              const newSelected = new Set(selectedIds);
              newSelected.delete(folderId);
              setSelectedIds(newSelected);
              if (newSelected.size === 0) {
                setIsMultiSelectMode(false);
              }
            } else {
              // If not selected, select it
              const newSelected = new Set(selectedIds);
              newSelected.add(folderId);
              setSelectedIds(newSelected);
            }
          } else {
            // Normal press - open folder or do default action
            // TODO: Open folder
          }
        }}
        onFolderLongPress={handleFolderLongPress}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        isMultiSelectMode={isMultiSelectMode}
      />
      <TouchableOpacity
        style={[styles.uploadButton, { bottom: insets.bottom + 16 }]}
        onPress={pickAndUpload}
        activeOpacity={0.8}
      >
        <Feather name="upload" size={24} color={Colors.brightText} />
      </TouchableOpacity>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    marginTop: 50,
  },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RoomDetailsScreen;

