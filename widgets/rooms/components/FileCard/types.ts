import { FileItem } from '@/api/types/file';
import { FileMenuManager } from '../../menu/fileMenu';

export interface FileCardProps {
  file: FileItem;
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
}
