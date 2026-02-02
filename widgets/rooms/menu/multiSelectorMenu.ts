import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

export const createMultiSelectMenuItems = (
  selectedIds: Set<string>,
  onDownload: (ids: string[]) => void,
  onDelete: (ids: string[]) => void,
  onReset: () => void
): ActionMenuItemData[] => [
  {
    id: "download-selected",
    icon: "download",
    label: "Download Selected",
    onPress: () => {
      onDownload(Array.from(selectedIds));
      onReset();
    },
  },
  {
    id: "delete-selected",
    icon: "trash-2",
    label: "Delete Selected",
    destructive: true,
    onPress: () => {
      onDelete(Array.from(selectedIds));
    },
  },
];
