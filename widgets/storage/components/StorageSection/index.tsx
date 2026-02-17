import { StorageItem } from "@/api/types/storage";
import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import { View } from "react-native";

interface StorageSectionProps {
  items: StorageItem[];
  previewEnabled?: boolean;
  favoriteItemIds?: Set<string>;
  previewUrls?: Record<string, string>;
  onFolderPress?: (folder: StorageItem) => void;
  getMenuItems?: (
    item: StorageItem,
    ctx: { isFavorite: boolean }
  ) => ActionMenuItemData[];
}

export const StorageSection = () => {
  return (
    <View>

    </View>
  );
};