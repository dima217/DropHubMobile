import { Colors } from '@/constants/design-tokens';
import AuthorshipSection from '@/shared/ui/AuthorshipSection';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import PreviewModal from './modals/PreviewModal';
import { styles } from './styles';
import type { FileCardProps } from './types';
import Header from './ui/Header';
import ImagePreview from './ui/ImagePreview';
import InlineVideo from './ui/InlineVideo';
import Progress from './ui/Progress';
import { getRemoteMediaUri } from './utils';
import { useFileCardThumbnail } from './useFileCardThumbnail';

const FileCard: React.FC<FileCardProps> = ({
  file,
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

  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const canPreview = (isImage || isVideo) && showPreview;
  const remoteMediaUri = getRemoteMediaUri(file.key);

  const thumbnailUri = useFileCardThumbnail(
    file.key,
    !!isVideo,
    !!isImage,
    showPreview
  );

  const progress =
    uploadProgress !== undefined ? uploadProgress : downloadProgress;

  const primaryTagColor = tags.length > 0
    ? tags.map((t) => tagColors[t]).find(Boolean) || undefined
    : undefined;

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
          (isVideo ? remoteMediaUri : thumbnailUri) &&
          (isVideo && remoteMediaUri ? (
            <InlineVideo
              uri={remoteMediaUri}
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
        remoteMediaUri={remoteMediaUri}
        imageUri={thumbnailUri}
      />
    </Pressable>
  );
};

export default FileCard;
export type { FileCardProps } from './types';
