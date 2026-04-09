import { useLazyDownloadRoomFilesQuery } from '@/api/fileApi';
import { Colors } from '@/constants/design-tokens';
import AuthorshipSection from '@/shared/ui/AuthorshipSection';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Pressable, View } from 'react-native';
import PreviewModal from './modals/PreviewModal';
import { styles } from './styles';
import type { FileCardProps } from './types';
import Header from './ui/Header';
import ImagePreview from './ui/ImagePreview';
import InlineVideo from './ui/InlineVideo';
import Progress from './ui/Progress';
import { useFileCardThumbnail } from './useFileCardThumbnail';
import { getRemoteMediaUri } from './utils';

const FileCard: React.FC<FileCardProps> = ({
  file,
  roomId,
  showPreview = false,
  showAuthorship = false,
  authorAvatarUrl,
  authorFirstName,
  authorUserId,
  menuItems,
  isSelected = false,
  isFavorite = false,
  onPress,
  onLongPress,
  uploadProgress,
  downloadProgress,
  tags = [],
  tagColors = {},
}) => {
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [roomSignedUrl, setRoomSignedUrl] = useState<string | null>(null);
  const [fetchRoomDownloadUrl] = useLazyDownloadRoomFilesQuery();

  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const canPreview = (isImage || isVideo) && showPreview;
  const remoteMediaUri = getRemoteMediaUri(file.key);

  useEffect(() => {
    if (!showPreview || !roomId) {
      setRoomSignedUrl(null);
      return;
    }
    if (remoteMediaUri) {
      setRoomSignedUrl(null);
      return;
    }
    if (file.key.startsWith('file://')) {
      setRoomSignedUrl(null);
      return;
    }
    let cancelled = false;
    fetchRoomDownloadUrl({ fileIds: [file._id], roomId })
      .unwrap()
      .then((rows) => {
        const url = rows.find((r) => r.fileId === file._id)?.url;
        if (!cancelled) setRoomSignedUrl(url ?? null);
      })
      .catch(() => {
        if (!cancelled) setRoomSignedUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [showPreview, roomId, file._id, file.key, remoteMediaUri, fetchRoomDownloadUrl]);

  const mediaUriForThumbnail = remoteMediaUri ?? roomSignedUrl ?? file.key;

  const thumbnailUri = useFileCardThumbnail(
    mediaUriForThumbnail,
    !!isVideo,
    !!isImage,
    showPreview
  );

  const progress =
    uploadProgress !== undefined ? uploadProgress : downloadProgress;

  const primaryTagColor = tags.length > 0
    ? tags.map((t) => tagColors[t]).find(Boolean) || undefined
    : undefined;

  const streamOrImageUri = remoteMediaUri ?? roomSignedUrl;

  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        primaryTagColor ? { borderColor: primaryTagColor } : null,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {showAuthorship && (
        <AuthorshipSection
          avatarUrl={authorAvatarUrl}
          firstName={authorFirstName}
          userId={authorUserId}
        />
      )}

      <View style={styles.content}>
        <Header
          file={file}
          isImage={!!isImage}
          isVideo={!!isVideo}
          isFavorite={isFavorite}
          isSelected={isSelected}
          menuItems={menuItems}
          tags={tags}
          tagColors={tagColors}
        />

        {progress !== undefined && <Progress progress={progress} />}

        {canPreview &&
          (isVideo ? streamOrImageUri : thumbnailUri) &&
          (isVideo && streamOrImageUri ? (
            <InlineVideo
              uri={streamOrImageUri}
              posterUri={thumbnailUri}
              overlayPaused={showFullPreview}
              onOpenFull={() => setShowFullPreview(true)}
            />
          ) : (
            thumbnailUri && (
              <ImagePreview
                uri={thumbnailUri}
                onOpenFull={() => setShowFullPreview(true)}
              />
            )
          ))}
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Feather name="check-circle" size={20} color={Colors.primary} />
        </View>
      )}

      <PreviewModal
        visible={showFullPreview}
        onClose={() => setShowFullPreview(false)}
        isVideo={!!isVideo}
        remoteMediaUri={streamOrImageUri}
        imageUri={thumbnailUri}
      />
    </Pressable>
  );
};

export default FileCard;
export type { FileCardProps } from './types';
