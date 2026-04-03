export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

export function getFileIconName(
  mimeType: string | undefined,
  isImage: boolean,
  isVideo: boolean
): 'image' | 'video' | 'file-text' | 'archive' | 'file' {
  if (isImage) return 'image';
  if (isVideo) return 'video';
  if (mimeType?.includes('pdf')) return 'file-text';
  if (mimeType?.includes('zip') || mimeType?.includes('rar')) return 'archive';
  return 'file';
}

export function getRemoteMediaUri(key: string | undefined): string | null {
  if (!key) return null;
  if (key.startsWith('http://') || key.startsWith('https://')) return key;
  return null;
}
