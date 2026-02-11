import { useGetFavoritesQuery } from "@/api/favorites";
import { FileItem, FileUploadStatus } from "@/api/types/file";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import { TagColorMap } from "@/store/slices/tagColorsSlice";
import { RootState } from "@/store/store";
import FileCard from "@/widgets/rooms/components/FileCard";
import FolderCard from "@/widgets/rooms/components/FolderCard";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  View as RNView,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";

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

const FavoritesScreen = () => {
  const { data: favorites, isLoading } = useGetFavoritesQuery();
  const router = useRouter();
  const tagColors = useSelector(
    (state: RootState) => (state.tagColors as { colors: TagColorMap }).colors
  );

  const handleNavigateToItem = useCallback(
    (item: StorageItem) => {
      // Navigate to storage tab at the folder containing this item
      const targetParentId = item.isDirectory ? item.id : (item.parentId || "");
      router.push({
        pathname: "/(tabs)/storage",
        params: { targetParentId },
      });
    },
    [router]
  );

  return (
    <View>
      <Header title="Избранное" />

      {isLoading ? (
        <RNView style={styles.center}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </RNView>
      ) : (
        <FlatList
          data={favorites?.items || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const itemTags = item.tags || [];

            if (item.isDirectory) {
              return (
                <FolderCard
                  folderId={item.id}
                  folderName={item.name}
                  itemCount={
                    item.childrenCount ||
                    (item.filesCount || 0) + (item.foldersCount || 0)
                  }
                  isFavorite
                  onPress={() => handleNavigateToItem(item)}
                  tags={itemTags}
                  tagColors={tagColors}
                />
              );
            } else {
              const file = mapStorageItemToFile(item);
              return (
                <FileCard
                  file={file}
                  isFavorite
                  onPress={() => handleNavigateToItem(item)}
                  tags={itemTags}
                  tagColors={tagColors}
                />
              );
            }
          }}
          ListEmptyComponent={
            <RNView style={styles.emptyContainer}>
              <Feather
                name="star"
                size={48}
                color={Colors.secondary}
                style={{ marginBottom: 12 }}
              />
              <ThemedText style={styles.emptyText}>
                Нет избранных элементов
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                Добавьте элементы в избранное через меню в хранилище
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
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
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
});

export default FavoritesScreen;
