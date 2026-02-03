import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

export class FileMenuManager {
    onDownload?: (ids: string[]) => void;
    onDelete?: (ids: string[]) => void;
    onShare?: (ids: string[]) => void;
    onEdit?: (ids: string[]) => void;
    constructor(onDownload?: (ids: string[]) => void, onDelete?: (ids: string[]) => void, onShare?: (ids: string[]) => void, onEdit?: (ids: string[]) => void) {
      this.onDownload = onDownload;
      this.onDelete = onDelete;
      this.onShare = onShare;
      this.onEdit = onEdit;
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
          id: 'share',
          icon: 'share-2',
          label: 'Share',
          onPress: () => this.onShare?.([fileId]),
        },
        {
          id: 'edit',
          icon: 'edit',
          label: 'Edit',
          onPress: () => this.onEdit?.([fileId])
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