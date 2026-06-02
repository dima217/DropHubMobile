import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

type TranslateFn = (text: string) => string;

export const createMultiSelectMenuItems = (
  selectedIds: Set<string>,
  onDownload: (ids: string[]) => void,
  onDelete: (ids: string[]) => void,
  onReset: () => void,
  tl: TranslateFn = (text) => text
): ActionMenuItemData[] => [
  {
    id: "download-selected",
    icon: "download",
    label: tl("Download Selected"),
    onPress: () => {
      onDownload(Array.from(selectedIds));
      onReset();
    },
  },
  {
    id: "delete-selected",
    icon: "trash-2",
    label: tl("Delete Selected"),
    destructive: true,
    onPress: () => {
      onDelete(Array.from(selectedIds));
    },
  },
];
