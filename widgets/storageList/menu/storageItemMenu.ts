import { StorageItem } from "@/api/types/storage";
import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

export type StorageItemMenuOption =
  | "download"
  | "rename"
  | "copy"
  | "move"
  | "favorite"
  | "tag"
  | "share"
  | "permissions"
  | "info"
  | "delete"
  | "restore"
  | "deletePermanent";

export type StorageItemMenuOptions =
  | {
      file: StorageItemMenuOption[];
      folder: StorageItemMenuOption[];
    }
  | ((item: StorageItem) => StorageItemMenuOption[]);

export interface StorageItemMenuHandlers {
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
  onRestore?: (item: StorageItem) => void;
  onDeletePermanent?: (item: StorageItem) => void;
}

export interface StorageItemMenuContext {
  isFavorite: boolean;
  canRestore?: boolean;
}

const pickOptions = (options: StorageItemMenuOptions, item: StorageItem) => {
  if (typeof options === "function") return options(item);
  return item.isDirectory ? options.folder : options.file;
};

export const createStorageItemMenuItems = (
  item: StorageItem,
  ctx: StorageItemMenuContext,
  handlers: StorageItemMenuHandlers,
  options: StorageItemMenuOptions
): ActionMenuItemData[] => {
  const {
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
    onRestore,
    onDeletePermanent,
  } = handlers;

  const enabled = new Set(pickOptions(options, item));

  const maybe = (opt: StorageItemMenuOption, menuItem: ActionMenuItemData) => {
    if (!enabled.has(opt)) return null;
    return menuItem;
  };

  const items: (ActionMenuItemData | null)[] = [
    onDownload
      ? maybe("download", {
      id: "download",
      icon: "download",
      label: "Скачать",
      onPress: () => onDownload!(item),
    })
      : null,
    onRename
      ? maybe("rename", {
      id: "rename",
      icon: "edit",
      label: "Переименовать",
      onPress: () => onRename!(item),
    })
      : null,
    onCopy
      ? maybe("copy", {
      id: "copy",
      icon: "copy",
      label: "Создать копию",
      onPress: () => onCopy!(item),
    })
      : null,
    onMove
      ? maybe("move", {
      id: "move",
      icon: "move",
      label: "Переместить",
      onPress: () => onMove!(item),
    })
      : null,
    onAddToFavorites || onRemoveFromFavorites
      ? maybe("favorite", {
      id: ctx.isFavorite ? "remove-favorite" : "add-favorite",
      icon: "heart",
      label: ctx.isFavorite ? "Удалить из избранного" : "Добавить в избранное",
      onPress: () => {
        if (ctx.isFavorite) onRemoveFromFavorites?.(item);
        else onAddToFavorites?.(item);
      },
    })
      : null,
    onAddTag
      ? maybe("tag", {
      id: "add-tag",
      icon: "tag",
      label: "Добавить тег",
      onPress: () => onAddTag!(item),
    })
      : null,
    onShare
      ? maybe("share", {
      id: "share",
      icon: "share-2",
      label: "Поделиться",
      onPress: () => onShare!(item),
    })
      : null,
    onViewPermissions
      ? maybe("permissions", {
      id: "permissions",
      icon: "users",
      label: "Посмотреть права доступа",
      onPress: () => onViewPermissions!(item),
    })
      : null,
    onInfo
      ? maybe("info", {
      id: "info",
      icon: "info",
      label: item.isDirectory ? "Информация о папке" : "Информация о файле",
      onPress: () => onInfo!(item),
    })
      : null,
    onRestore
      ? maybe("restore", {
      id: "restore",
      icon: "rotate-ccw",
      label: "Восстановить",
      disabled: ctx.canRestore === false,
      onPress: () => onRestore!(item),
    })
      : null,
    onDelete
      ? maybe("delete", {
      id: "delete",
      icon: "trash-2",
      label: "Удалить",
      destructive: true,
      onPress: () => onDelete!(item),
    })
      : null,
    onDeletePermanent
      ? maybe("deletePermanent", {
      id: "delete-permanent",
      icon: "trash-2",
      label: "Удалить навсегда",
      destructive: true,
      onPress: () => onDeletePermanent!(item),
    })
      : null,
  ];

  return items.filter(Boolean) as ActionMenuItemData[];
};


