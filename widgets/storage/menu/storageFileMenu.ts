import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import { StorageItem } from "@/api/types/storage";

export class StorageFileMenuManager {
  onDownload?: (item: StorageItem) => void;
  onRename?: (item: StorageItem) => void;
  onCopy?: (item: StorageItem) => void;
  onMove?: (item: StorageItem) => void;
  onAddToFavorites?: (item: StorageItem) => void;
  onRemoveFromFavorites?: (item: StorageItem) => void;
  onAddTag?: (item: StorageItem) => void;
  onShare?: (item: StorageItem) => void;
  onViewPermissions?: (item: StorageItem) => void;
  onInfo?: (item: StorageItem) => void;
  onDelete?: (item: StorageItem) => void;
  isFavorite?: boolean;

  constructor(
    onDownload?: (item: StorageItem) => void,
    onRename?: (item: StorageItem) => void,
    onCopy?: (item: StorageItem) => void,
    onMove?: (item: StorageItem) => void,
    onAddToFavorites?: (item: StorageItem) => void,
    onRemoveFromFavorites?: (item: StorageItem) => void,
    onAddTag?: (item: StorageItem) => void,
    onShare?: (item: StorageItem) => void,
    onViewPermissions?: (item: StorageItem) => void,
    onInfo?: (item: StorageItem) => void,
    onDelete?: (item: StorageItem) => void,
    isFavorite?: boolean
  ) {
    this.onDownload = onDownload;
    this.onRename = onRename;
    this.onCopy = onCopy;
    this.onMove = onMove;
    this.onAddToFavorites = onAddToFavorites;
    this.onRemoveFromFavorites = onRemoveFromFavorites;
    this.onAddTag = onAddTag;
    this.onShare = onShare;
    this.onViewPermissions = onViewPermissions;
    this.onInfo = onInfo;
    this.onDelete = onDelete;
    this.isFavorite = isFavorite;
  }

  getMenuItems(item: StorageItem): ActionMenuItemData[] {
    const items: ActionMenuItemData[] = [
      {
        id: "download",
        icon: "download",
        label: "Скачать",
        onPress: () => this.onDownload?.(item),
      },
      {
        id: "rename",
        icon: "edit",
        label: "Переименовать",
        onPress: () => this.onRename?.(item),
      },
      {
        id: "copy",
        icon: "copy",
        label: "Создать копию",
        onPress: () => this.onCopy?.(item),
      },
      {
        id: "move",
        icon: "move",
        label: "Переместить",
        onPress: () => this.onMove?.(item),
      },
      {
        id: this.isFavorite ? "remove-favorite" : "add-favorite",
        icon: this.isFavorite ? "heart" : "heart",
        label: this.isFavorite ? "Удалить из избранного" : "Добавить в избранное",
        onPress: () => {
          if (this.isFavorite) {
            this.onRemoveFromFavorites?.(item);
          } else {
            this.onAddToFavorites?.(item);
          }
        },
      },
      {
        id: "add-tag",
        icon: "tag",
        label: "Добавить тег",
        onPress: () => this.onAddTag?.(item),
      },
      {
        id: "share",
        icon: "share-2",
        label: "Поделиться",
        onPress: () => this.onShare?.(item),
      },
      {
        id: "permissions",
        icon: "users",
        label: "Посмотреть права доступа",
        onPress: () => this.onViewPermissions?.(item),
      },
      {
        id: "info",
        icon: "info",
        label: "Информация о файле",
        onPress: () => this.onInfo?.(item),
      },
      {
        id: "delete",
        icon: "trash-2",
        label: "Удалить",
        destructive: true,
        onPress: () => this.onDelete?.(item),
      },
    ];

    return items;
  }
}

