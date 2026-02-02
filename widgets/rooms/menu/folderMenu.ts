import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

export const folderMenuItems: ActionMenuItemData[] = [
  {
    id: "open",
    icon: "folder",
    label: "Open",
    onPress: () => {},
  },
  {
    id: "delete",
    icon: "trash-2",
    label: "Delete",
    destructive: true,
    onPress: () => {},
  },
];
