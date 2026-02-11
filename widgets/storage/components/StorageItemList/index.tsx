import { FileItem, FileUploadStatus } from "@/api/types/file";
import { StorageItem } from "@/api/types/storage";
import { TagColorMap } from "@/store/slices/tagColorsSlice";
import { RootState } from "@/store/store";
import FileCard from "@/widgets/rooms/components/FileCard";
import FolderCard from "@/widgets/rooms/components/FolderCard";
import { StorageFileMenuManager } from "@/widgets/storage/menu/storageFileMenu";
import { StorageFolderMenuManager } from "@/widgets/storage/menu/storageFolderMenu";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import { useSelector } from "react-redux";

const mapStorageItemToFile = (
  item: StorageItem,
  previewUrl?: string
): FileItem => {
  const meta = item.fileMeta;
  return {
    _id: meta?._id || item.id,
    originalName: meta?.originalName || item.name,
    storedName: meta?.storedName || item.name,
    size: meta?.size || 0,
    mimeType: meta?.mimeType || "application/octet-stream",
    uploadTime: meta?.uploadTime || new Date().toISOString(),
    downloadCount: meta?.downloadCount || 0,
    key: previewUrl || "",
    uploadedParts: 0,
    expiresAt: null,
    creatorId: meta?.creatorId || Number(item.creatorId) || 0,
    uploadSession: { status: FileUploadStatus.COMPLETE },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };
};

interface StorageItemListProps {
  items: StorageItem[];
  previewEnabled: boolean;
  favoriteItemIds: Set<string>;
  previewUrls?: Record<string, string>;
  onFolderPress: (folder: StorageItem) => void;
  onDownload: (item: StorageItem) => void;
  onRename: (item: StorageItem) => void;
  onCopy: (item: StorageItem) => void;
  onMove: (item: StorageItem) => void;
  onAddToFavorites: (item: StorageItem) => void;
  onRemoveFromFavorites: (item: StorageItem) => void;
  onAddTag: (item: StorageItem) => void;
  onShare: (item: StorageItem) => void;
  onViewPermissions: (item: StorageItem) => void;
  onInfo: (item: StorageItem) => void;
  onDelete: (item: StorageItem) => void;
}

export const StorageItemList: React.FC<StorageItemListProps> = ({
  items,
  previewEnabled,
  favoriteItemIds,
  previewUrls = {},
  onFolderPress,
  onDownload,
  onRename,
  onCopy,
  onMove,
  onAddToFavorites,
  onRemoveFromFavorites,
  onAddTag,
  onShare,
  onViewPermissions,
  onInfo,
  onDelete,
}) => {
  const tagColors = useSelector(
    (state: RootState) => (state.tagColors as { colors: TagColorMap }).colors
  );

  const renderItem = ({ item }: { item: StorageItem }) => {
    const isFavorite = favoriteItemIds.has(item.id);
    const itemTags = item.tags || [];

    if (item.isDirectory) {
      const itemCount =
        item.childrenCount ??
        (item.filesCount || 0) + (item.foldersCount || 0);

      const menuManager = new StorageFolderMenuManager(
        onRename,
        onCopy,
        onMove,
        onAddToFavorites,
        onRemoveFromFavorites,
        onAddTag,
        onShare,
        onViewPermissions,
        onInfo,
        onDelete,
        isFavorite
      );

      return (
        <FolderCard
          folderId={item.id}
          folderName={item.name}
          itemCount={itemCount}
          menuItems={menuManager.getMenuItems(item)}
          onPress={() => onFolderPress(item)}
          tags={itemTags}
          tagColors={tagColors}
          isFavorite={isFavorite}
        />
      );
    }

    const fileId = item.fileId || item.id;
    const url = previewUrls[fileId];
    const file = mapStorageItemToFile(item, url);
    const menuManager = new StorageFileMenuManager(
      onDownload,
      onRename,
      onCopy,
      onMove,
      onAddToFavorites,
      onRemoveFromFavorites,
      onAddTag,
      onShare,
      onViewPermissions,
      onInfo,
      onDelete,
      isFavorite
    );

    return (
      <FileCard
        file={file}
        showPreview={previewEnabled}
        menuItems={{
          getMenuItems: () => menuManager.getMenuItems(item),
        }}
        tags={itemTags}
        tagColors={tagColors}
        isFavorite={isFavorite}
      />
    );
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
  },
});
