import {
  useGetTrashItemsQuery,
  useRestoreTrashItemMutation,
  useDeleteStorageItemMutation,
  useGetStorageInfoQuery,
} from "@/api/storageApi";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View as RNView,
} from "react-native";
import FileCard from "@/widgets/rooms/components/FileCard";
import FolderCard from "@/widgets/rooms/components/FolderCard";
import { StorageItem } from "@/api/types/storage";
import { FileItem, FileUploadStatus } from "@/api/types/file";
import { Feather } from "@expo/vector-icons";

const mapStorageItemToFile = (item: StorageItem): FileItem => {
  const meta = item.fileMeta;
  return {
    _id: meta?._id || item.id,
    originalName: meta?.originalName || item.name,
    storedName: meta?.storedName || item.name,
    size: meta?.size || 0,
    mimeType: meta?.mimeType || "application/octet-stream",
    uploadTime: meta?.uploadTime || new Date().toISOString(),
    downloadCount: meta?.downloadCount || 0,
    key: "",
    uploadedParts: 0,
    expiresAt: null,
    creatorId: meta?.creatorId || Number(item.creatorId) || 0,
    uploadSession: { status: FileUploadStatus.COMPLETE },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };
};

const TrashScreen = () => {
  const { data: storageInfo } = useGetStorageInfoQuery();
  const storageId = storageInfo?.id || "";

  const { data: trashItems, isLoading, refetch } = useGetTrashItemsQuery(
    { storageId },
    { skip: !storageId }
  );

  const [restoreItem] = useRestoreTrashItemMutation();
  const [deletePermanently] = useDeleteStorageItemMutation();

  const handleRestore = async (item: StorageItem) => {
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
  };

  const handleDeletePermanently = async (item: StorageItem) => {
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
  };

  return (
    <View>
      <Header title="Корзина" />

      {isLoading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : (
        <FlatList
          data={trashItems || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RNView style={styles.itemContainer}>
              {item.isDirectory ? (
                <FolderCard
                  folderId={item.id}
                  folderName={item.name}
                  itemCount={0}
                />
              ) : (
                <FileCard file={mapStorageItemToFile(item)} />
              )}
              <RNView style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleRestore(item)}
                >
                  <Feather name="rotate-ccw" size={20} color={Colors.primary} />
                  <ThemedText style={styles.actionText}>Восстановить</ThemedText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDeletePermanently(item)}
                >
                  <Feather name="trash-2" size={20} color={Colors.reject} />
                  <ThemedText style={[styles.actionText, styles.deleteText]}>
                    Удалить навсегда
                  </ThemedText>
                </TouchableOpacity>
              </RNView>
            </RNView>
          )}
          ListEmptyComponent={
            <RNView style={styles.emptyContainer}>
              <ThemedText style={styles.emptyText}>
                Корзина пуста
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
  itemContainer: {
    marginBottom: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  deleteButton: {
    borderColor: Colors.reject,
  },
  actionText: {
    fontSize: 14,
    color: Colors.primary,
  },
  deleteText: {
    color: Colors.reject,
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

