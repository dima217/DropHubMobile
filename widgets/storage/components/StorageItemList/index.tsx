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

export type StorageItemListHandle = Pick<FlatList<StorageItem>, "scrollToOffset">;

const mapStorageItemToFile = (
  item: StorageItem,
  previewUrl?: string
): FileItem => {
  const meta = item.fileMeta;
  const resolvedSize = item.size ?? meta?.size ?? 0;
  const resolvedDownloadCount = item.downloadCount ?? meta?.downloadCount ?? 0;
  return {
    _id: meta?._id || item.id,
    originalName: meta?.originalName || item.name,
    storedName: item.name || meta?.storedName || meta?.originalName || "",
    size: resolvedSize,
    mimeType: meta?.mimeType || "application/octet-stream",
    uploadTime: meta?.uploadTime || new Date().toISOString(),
    downloadCount: resolvedDownloadCount,
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

/** Как в комнате: длинное нажатие включает выбор, в режиме выбора — тап переключает. */
export interface StorageItemListMultiSelect {
  active: boolean;
  selectedIds: Set<string>;
  onToggle: (item: StorageItem) => void;
}

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
  /**
   * Optional authorship rendering for each item.
   * When enabled, cards can show owner avatar/name.
   */
  showAuthorship?: boolean;
  getItemAuthor?: (item: StorageItem) => {
    avatarUrl?: string;
    firstName?: string;
    userId?: number;
  } | null;
  /** Режим множественного выбора (как `ResourcesSection` в комнате). */
  multiSelect?: StorageItemListMultiSelect;
  /** Не показывать меню по элементу (режим выбора папки назначения и т.п.). */
  suppressMenus?: boolean;
  /** Content rendered above the list items (breadcrumbs, quota bar, etc.) when scrollableHeader mode is active. */
  listHeader?: React.ReactNode;
}

export const StorageItemList = React.forwardRef<
  FlatList<StorageItem>,
  StorageItemListProps
>(({
  items,
  previewEnabled = false,
  favoriteItemIds,
  previewUrls = {},
  onFolderPress,
  disabledFolderIds,
  getMenuItems,
  showAuthorship = false,
  getItemAuthor,
  multiSelect,
  suppressMenus = false,
  listHeader,
}, ref) => {
  const tagColors = useSelector(
    (state: RootState) => (state.tagColors as { colors: TagColorMap }).colors
  );

  const renderItem = ({ item }: { item: StorageItem }) => {
    const isFavorite = favoriteItemIds?.has(item.id) ?? false;
    const itemTags = item.tags || [];
    const author = getItemAuthor ? getItemAuthor(item) : null;
    const ms = multiSelect;
    const isSelected = ms?.selectedIds.has(item.id) ?? false;
    const menusOff = suppressMenus || ms?.active;

    if (item.isDirectory) {
      const isDisabled = disabledFolderIds?.has(item.id) ?? false;
      const itemCount =
        item.childrenCount ??
        (item.filesCount || 0) + (item.foldersCount || 0);
      const menuItems = menusOff
        ? []
        : (getMenuItems?.(item, { isFavorite }) ?? []);

      return (
        <FolderCard
          folderId={item.id}
          folderName={item.name}
          itemCount={itemCount}
          showAuthorship={showAuthorship}
          authorAvatarUrl={author?.avatarUrl}
          authorFirstName={author?.firstName}
          authorUserId={author?.userId}
          menuItems={menuItems}
          disabled={isDisabled}
          isSelected={isSelected}
          onPress={() => {
            if (isDisabled) return;
            if (ms?.active) {
              ms.onToggle(item);
              return;
            }
            onFolderPress?.(item);
          }}
          onLongPress={ms ? () => ms.onToggle(item) : undefined}
          tags={itemTags}
          tagColors={tagColors}
          isFavorite={isFavorite}
          sharedWith={item.sharedWith ?? []}
        />
      );
    }

    const fileId = item.fileId || item.id;
    const url = previewUrls[fileId];
    const file = mapStorageItemToFile(item, url);
    const menuItems = menusOff
      ? []
      : (getMenuItems?.(item, { isFavorite }) ?? []);

    return (
      <FileCard
        file={file}
        showPreview={previewEnabled}
        showAuthorship={showAuthorship}
        authorAvatarUrl={author?.avatarUrl}
        authorFirstName={author?.firstName}
        authorUserId={author?.userId}
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
        sharedWith={item.sharedWith ?? []}
        isSelected={isSelected}
        onPress={ms?.active ? () => ms.onToggle(item) : undefined}
        onLongPress={ms ? () => ms.onToggle(item) : undefined}
      />
    );
  };

  return (
    <FlatList
      ref={ref}
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={listHeader ? () => <>{listHeader}</> : undefined}
      contentContainerStyle={styles.listContent}
    />
  );
});

StorageItemList.displayName = "StorageItemList";

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
  },
});
