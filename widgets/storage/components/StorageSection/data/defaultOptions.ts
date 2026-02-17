import { StorageItemMenuOptions } from "@/widgets/storageList/menu/storageItemMenu";
import { ResolvedStorageSectionOptions } from "..";

export const defaultOptions: ResolvedStorageSectionOptions = {
  showBreadcrumbs: true,
  showPreviewToggle: true,
  showFAB: false,
  showGlobalTagsButton: false,
  targetParentId: undefined,
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
