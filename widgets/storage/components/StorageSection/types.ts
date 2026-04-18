import type React from "react";
import type { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import type { StorageItem } from "@/api/types/storage";
import type { StorageItemMenuOptions } from "@/widgets/storageList/menu/storageItemMenu";

/**
 * Display and behaviour options for the storage section.
 * All fields are optional; missing values fall back to defaults from `defaultOptions`.
 */
export interface StorageSectionOptions {
  showBreadcrumbs?: boolean;
  showPreviewToggle?: boolean;
  showFAB?: boolean;
  showGlobalTagsButton?: boolean;
  targetParentId?: string;
  rootLabel?: string;
  initialItems?: StorageItem[];
  enableMultiSelect?: boolean;
  favoritesBrowseMode?: boolean;
  menuOptionsAtVirtualRoot?: StorageItemMenuOptions;
  redirectMoveToStorageTab?: boolean;
  consumePendingMoveOnTabFocus?: boolean;
}

export type ResolvedStorageSectionOptions = StorageSectionOptions & {
  showBreadcrumbs: boolean;
  showPreviewToggle: boolean;
  showFAB: boolean;
  showGlobalTagsButton: boolean;
  enableMultiSelect: boolean;
  favoritesBrowseMode: boolean;
  redirectMoveToStorageTab: boolean;
  consumePendingMoveOnTabFocus: boolean;
};

export interface StorageSectionProps {
  options?: StorageSectionOptions;
  menuOptions: StorageItemMenuOptions;
  getMenuItems?: (
    item: StorageItem,
    ctx: { isFavorite: boolean }
  ) => ActionMenuItemData[];
  renderHeaderActions?: (params: {
    onOpenGlobalTags: () => void;
  }) => React.ReactNode;
  archiveMode?: {
    roomId: string;
    fileIds: string[];
    onCancel: () => void;
    onComplete: () => void;
  };
  externalData?: {
    items: StorageItem[];
    path: { id: string | null; name: string }[];
    onFolderPress: (folder: StorageItem) => void;
    onNavigate: (segmentId: string | null, index: number) => void;
    currentParentId?: string | null;
    effectiveParentId?: string | null;
  };
  sharedContext?: {
    storageId: string;
    resourceId: string;
    refetchStructure: () => void;
    quota: { usedBytes: number; maxBytes: number } | null;
    canManagePermissions: boolean;
    fabVisible?: boolean;
  };
  showAuthorship?: boolean;
  getItemAuthor?: (item: StorageItem) => {
    avatarUrl?: string;
    firstName?: string;
    userId?: number;
  } | null;
}
