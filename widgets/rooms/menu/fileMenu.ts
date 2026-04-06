import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import { getConversionOptions } from "@/shared/fileConversion/getConversionOptions";

export class FileMenuManager {
    onDownload?: (ids: string[]) => void;
    onDelete?: (ids: string[]) => void;
    onShare?: (ids: string[]) => void;
    onEdit?: (fileId: string, storedName: string) => void;
    /** Открыть выбор конвертации (показывается только если для файла есть варианты). */
    onConvert?: (fileId: string, storedName: string, mimeType: string) => void;
    constructor(
      onDownload?: (ids: string[]) => void,
      onDelete?: (ids: string[]) => void,
      onShare?: (ids: string[]) => void,
      onEdit?: (fileId: string, storedName: string) => void,
      onConvert?: (fileId: string, storedName: string, mimeType: string) => void,
    ) {
      this.onDownload = onDownload;
      this.onDelete = onDelete;
      this.onShare = onShare;
      this.onEdit = onEdit;
      this.onConvert = onConvert;
    }
  
    getMenuItems(fileId: string, storedName: string, mimeType: string): ActionMenuItemData[] {
      const items: ActionMenuItemData[] = [
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
          onPress: () => this.onEdit?.(fileId, storedName)
        },
      ];

      if (
        this.onConvert &&
        getConversionOptions(mimeType || "", storedName || "").length > 0
      ) {
        items.push({
          id: 'convert',
          icon: 'refresh-cw',
          label: 'Convert',
          onPress: () => this.onConvert?.(fileId, storedName, mimeType),
        });
      }

      items.push({
        id: 'delete',
        icon: 'trash-2',
        label: 'Delete',
        destructive: true,
        onPress: () => this.onDelete?.([fileId]),
      });

      return items;
    }
  }