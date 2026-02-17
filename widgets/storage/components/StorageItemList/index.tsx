import { FileItem, FileUploadStatus } from "@/api/types/file";
import { StorageItem } from "@/api/types/storage";
import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import { TagColorMap } from "@/store/slices/tagColorsSlice";
import { RootState } from "@/store/store";
import FileCard from "@/widgets/rooms/components/FileCard";
import FolderCard from "@/widgets/rooms/components/FolderCard";
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
  previewEnabled?: boolean;
  favoriteItemIds?: Set<string>;
  previewUrls?: Record<string, string>;
  onFolderPress?: (folder: StorageItem) => void;
  /** Folders that should be visually disabled and not clickable (e.g. folder being moved) */
  disabledFolderIds?: Set<string>;
  getMenuItems?: (
    item: StorageItem,
    ctx: { isFavorite: boolean }
  ) => ActionMenuItemData[];
}

export const StorageItemList: React.FC<StorageItemListProps> = ({
  items,
  previewEnabled = false,
  favoriteItemIds,
  previewUrls = {},
  onFolderPress,
  disabledFolderIds,
  getMenuItems,
}) => {
  const tagColors = useSelector(
    (state: RootState) => (state.tagColors as { colors: TagColorMap }).colors
  );

  const renderItem = ({ item }: { item: StorageItem }) => {
    const isFavorite = favoriteItemIds?.has(item.id) ?? false;
    const itemTags = item.tags || [];

    if (item.isDirectory) {
      const isDisabled = disabledFolderIds?.has(item.id) ?? false;
      const itemCount =
        item.childrenCount ??
        (item.filesCount || 0) + (item.foldersCount || 0);
      const menuItems = getMenuItems?.(item, { isFavorite }) ?? [];

      return (
        <FolderCard
          folderId={item.id}
          folderName={item.name}
          itemCount={itemCount}
          menuItems={menuItems}
          disabled={isDisabled}
          onPress={() => {
            if (isDisabled) return;
            onFolderPress?.(item);
          }}
          tags={itemTags}
          tagColors={tagColors}
          isFavorite={isFavorite}
        />
      );
    }

    const fileId = item.fileId || item.id;
    const url = previewUrls[fileId];
    const file = mapStorageItemToFile(item, url);
    const menuItems = getMenuItems?.(item, { isFavorite }) ?? [];

    return (
      <FileCard
        file={file}
        showPreview={previewEnabled}
        menuItems={
          menuItems.length > 0
            ? {
                getMenuItems: () => menuItems,
              }
            : undefined
        }
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
