import * as VideoThumbnails from 'expo-video-thumbnails';
import { useEffect, useState } from 'react';

export function useFileCardThumbnail(
  fileKey: string | undefined,
  isVideo: boolean,
  isImage: boolean,
  showPreview: boolean
): string | null {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);

  useEffect(() => {
    if (isVideo && showPreview && fileKey) {
      if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) {
        VideoThumbnails.getThumbnailAsync(fileKey, { time: 1000 })
          .then(({ uri }) => setThumbnailUri(uri))
          .catch(() => setThumbnailUri(null));
      } else {
        setThumbnailUri(null);
      }
    } else if (isImage && showPreview && fileKey) {
      if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) {
        setThumbnailUri(fileKey);
      } else {
        setThumbnailUri(null);
      }
    } else if (!showPreview) {
      setThumbnailUri(null);
    }
  }, [isVideo, isImage, showPreview, fileKey]);

  return thumbnailUri;
}
