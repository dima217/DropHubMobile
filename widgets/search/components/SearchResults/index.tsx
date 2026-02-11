import { FileItem, FileUploadStatus } from "@/api/types/file";
import { SearchFile, SearchResponse } from "@/api/types/search";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import FileCard from "@/widgets/rooms/components/FileCard";
import FolderCard from "@/widgets/rooms/components/FolderCard";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  View as RNView,
  StyleSheet,
} from "react-native";

const mapSearchFileToFileItem = (item: SearchFile): FileItem => {
  return {
    _id: item.id,
    originalName: item.originalName,
    mimeType: item.mimeType,
    size: item.size,
    creatorId: item.creatorId,
    storedName: item.originalName,
    key: "",
    uploadTime: new Date().toISOString(),
    downloadCount: 0,
    uploadedParts: 0,
    expiresAt: null,
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

  const items = [];

  if (results?.storageItems) {
    for (const storageItem of results.storageItems) {
      if (storageItem.isDirectory) {
        items.push({ type: "folder" as const, item: storageItem });
      } else {
        items.push({ type: "file" as const, file: mapSearchFileToFileItem(storageItem as any) });
      }
    }
  }
  
  if (results?.files) {
    items.push(...results.files.map((file) => ({ type: "file" as const, file: mapSearchFileToFileItem(file) })));
  }
  

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) =>
        item.type === "folder" ? item.item.id : item.file?._id || ""
      }
      renderItem={({ item }) => {
        switch (item.type) {
          case "folder":
            return (
              <FolderCard
                folderId={item.item.id}
                folderName={item.item.name}
                itemCount={
                  item.item.childrenCount ||
                  (item.item.filesCount || 0) + (item.item.foldersCount || 0)
                }
              />
            );
          case "file":
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

