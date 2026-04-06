import { StorageItemMenuOptions } from "@/widgets/storageList/menu/storageItemMenu";
import { ResolvedStorageSectionOptions } from "..";

export const defaultOptions: ResolvedStorageSectionOptions = {
  showBreadcrumbs: true,
  showPreviewToggle: true,
  showFAB: false,
  showGlobalTagsButton: false,
  targetParentId: undefined,
  rootLabel: "Root",
  initialItems: undefined,
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
