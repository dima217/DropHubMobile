import { SearchResponse } from "@/api/types/search";
import { StorageItem } from "@/api/types/storage";
import { FileItem, FileUploadStatus } from "@/api/types/file";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import FileCard from "@/widgets/rooms/components/FileCard";
import FolderCard from "@/widgets/rooms/components/FolderCard";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  View as RNView,
} from "react-native";

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

interface SearchResultsProps {
  results: SearchResponse | undefined;
  isLoading: boolean;
  searchQuery: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  searchQuery,
}) => {
  if (isLoading) {
    return (
      <RNView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </RNView>
    );
  }

  const items = [
    ...(results?.storageItems || []).map((item) => ({
      type: "storage" as const,
      item,
    })),
    ...(results?.files || []).map((file) => ({
      type: "file" as const,
      file,
    })),
  ];

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) =>
        item.type === "storage" ? item.item.id : item.file._id
      }
      renderItem={({ item }) => {
        if (item.type === "storage") {
          const storageItem = item.item;
          if (storageItem.isDirectory) {
            return (
              <FolderCard
                folderId={storageItem.id}
                folderName={storageItem.name}
                itemCount={
                  storageItem.childrenCount ||
                  (storageItem.filesCount || 0) +
                    (storageItem.foldersCount || 0)
                }
              />
            );
          } else {
            const file = mapStorageItemToFile(storageItem);
            return <FileCard file={file} />;
          }
        } else {
          return <FileCard file={item.file} />;
        }
      }}
      ListEmptyComponent={
        <RNView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {searchQuery ? "Ничего не найдено" : "Введите запрос для поиска"}
          </ThemedText>
        </RNView>
      }
      contentContainerStyle={styles.listContent}
    />
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
    fontSize: 14,
  },
});

