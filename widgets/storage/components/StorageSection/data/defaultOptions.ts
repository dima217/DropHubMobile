import { StorageItemMenuOptions } from "@/widgets/storageList/menu/storageItemMenu";
import type { ResolvedStorageSectionOptions } from "../types";

export const defaultOptions: ResolvedStorageSectionOptions = {
  showBreadcrumbs: true,
  showPreviewToggle: true,
  showFAB: false,
  showGlobalTagsButton: false,
  targetParentId: undefined,
  rootLabel: "Root",
  initialItems: undefined,
  enableMultiSelect: true,
  favoritesBrowseMode: false,
  menuOptionsAtVirtualRoot: undefined,
  redirectMoveToStorageTab: false,
  consumePendingMoveOnTabFocus: false,
};
  
export const menuOptions: StorageItemMenuOptions =
  ({
    folder: [
      "rename",
      "copy",
      "move",
      "favorite",
      "tag",
      "share",
      "permissions",
      "info",
      "delete",
    ],
    file: [
      "download",
      "convert",
      "rename",
      "copy",
      "move",
      "favorite",
      "tag",
      "share",
      "permissions",
      "info",
      "delete",
    ],
  })
