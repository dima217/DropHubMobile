import { FileItem, FileUploadStatus } from "@/api/types/file";
import {
  SearchFile,
  SearchResourceType,
  SearchResponse,
} from "@/api/types/search";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import FileCard from "@/widgets/rooms/components/FileCard";
import FolderCard from "@/widgets/rooms/components/FolderCard";
import { StorageSection } from "@/widgets/storage/components/StorageSection";
import { menuOptions as storageMenuOptions } from "@/widgets/storage/components/StorageSection/data/defaultOptions";
import { useRouter } from "expo-router";
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
  resourceType: SearchResourceType;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  isLoading,
  searchQuery,
  resourceType,
}) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <RNView style={styles.center}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </RNView>
    );
  }

  // When searching only in storage, show a full-featured StorageSection
  // with search results acting as a "virtual root", so that the user
  // can work with them exactly as if they opened the storage screen.
  if (resourceType === SearchResourceType.STORAGE) {
    const storageItems = results?.storageItems ?? [];

    if (storageItems.length === 0) {
      return (
        <RNView style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>
            {searchQuery ? "Ничего не найдено" : "Введите запрос для поиска"}
          </ThemedText>
        </RNView>
      );
    }

    return (
      <RNView style={styles.storageSectionContainer}>
        <StorageSection
          options={{
            showBreadcrumbs: true,
            showPreviewToggle: true,
            showFAB: true,
            showGlobalTagsButton: false,
            rootLabel: "Результаты поиска",
            initialItems: storageItems,
          }}
          menuOptions={storageMenuOptions}
        />
      </RNView>
    );
  }

  const items: (
    | { type: "storage"; item: StorageItem }
    | { type: "searchFile"; file: SearchFile }
  )[] = [];

  if (results?.storageItems) {
    items.push(...results.storageItems.map((it) => ({ type: "storage" as const, item: it })));
  }

  if (results?.files) {
    items.push(...results.files.map((file) => ({ type: "searchFile" as const, file })));
  }
  

  return (
    <FlatList
      data={items}
      keyExtractor={(row) => (row.type === "storage" ? row.item.id : row.file.id)}
      renderItem={({ item: row }) => {
        if (row.type === "storage") {
          const it = row.item;

          const targetParentId = it.isDirectory ? it.id : it.parentId;
          const goToStorageFolder = () => {
            if (targetParentId === null || targetParentId === undefined) {
              router.push("/(tabs)/storage");
              return;
            }

            router.push({
              pathname: "/(tabs)/storage",
              params: { targetParentId },
            });
          };

          if (it.isDirectory) {
            return (
              <FolderCard
                folderId={it.id}
                folderName={it.name}
                itemCount={
                  it.childrenCount ?? (it.filesCount || 0) + (it.foldersCount || 0)
                }
                onPress={goToStorageFolder}
              />
            );
          }

          // Simple display; main action is redirect to containing folder.
          const file: FileItem = {
            _id: it.fileMeta?._id || it.id,
            originalName: it.fileMeta?.originalName || it.name,
            storedName: it.fileMeta?.storedName || it.name,
            size: it.fileMeta?.size || 0,
            mimeType: it.fileMeta?.mimeType || "application/octet-stream",
            uploadTime: it.fileMeta?.uploadTime || new Date().toISOString(),
            downloadCount: it.fileMeta?.downloadCount || 0,
            key: "",
            uploadedParts: 0,
            expiresAt: null,
            creatorId: it.fileMeta?.creatorId || Number(it.creatorId) || 0,
            uploadSession: { status: FileUploadStatus.COMPLETE },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            __v: 0,
          };

          return <FileCard file={file} onPress={goToStorageFolder} />;
        }

        // Non-storage results stay as simple cards for now.
        const goToResource = () => {
          if (row.file.resourceType === SearchResourceType.ROOM) {
            router.push(`/(tabs)/rooms/${row.file.resourceId}`);
            return;
          }

          if (row.file.resourceType === SearchResourceType.STORAGE) {
            // SearchFile doesn't include parentId/itemId, so we can only open storage root.
            router.push("/(tabs)/storage");
            return;
          }
        };

        return <FileCard file={mapSearchFileToFileItem(row.file)} onPress={goToResource} />;
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
  storageSectionContainer: {
    flex: 1,
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

