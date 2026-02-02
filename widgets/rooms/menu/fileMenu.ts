import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

export class FileMenuManager {
    onDownload?: (ids: string[]) => void;
    onDelete?: (ids: string[]) => void;
  
    constructor(onDownload?: (ids: string[]) => void, onDelete?: (ids: string[]) => void) {
      this.onDownload = onDownload;
      this.onDelete = onDelete;
    }
  
    getMenuItems(fileId: string): ActionMenuItemData[] {
      return [
        {
          id: 'download',
          icon: 'download',
          label: 'Download',
          onPress: () => this.onDownload?.([fileId]),
        },
        {
          id: 'delete',
          icon: 'trash-2',
          label: 'Delete',
          destructive: true,
          onPress: () => this.onDelete?.([fileId]),
        },
      ];
    }
}
  