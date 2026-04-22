import { FileItem } from '@/api/types/file';
import type { StorageSharedWithUser } from '@/api/types/storage';
import { FileMenuManager } from '../../menu/fileMenu';

export interface FileCardProps {
  file: FileItem;
  /** Room id for fetching signed download URL when `file.key` is not already an http(s) or file:// URI */
  roomId?: string;
  showPreview?: boolean;
  showAuthorship?: boolean;
  authorAvatarUrl?: string;
  authorFirstName?: string;
  authorUserId?: number;
  menuItems?: FileMenuManager;
  isSelected?: boolean;
  isFavorite?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  uploadProgress?: number;
  downloadProgress?: number;
  tags?: string[];
  tagColors?: Record<string, string>;
  sharedWith?: StorageSharedWithUser[];
}
