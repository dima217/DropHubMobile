import { FileItem } from '@/api/types/file';
import { Colors } from '@/constants/design-tokens';
import { ThemedText } from '@/shared/core/ThemedText';
import ActionMenu from '@/shared/ui/ActionMenu';
import AuthorshipSection from '@/shared/ui/AuthorshipSection';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as VideoThumbnails from 'expo-video-thumbnails';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FileMenuManager } from '../../menu/fileMenu';

interface FileCardProps {
  file: FileItem;
  showPreview?: boolean;
  showAuthorship?: boolean;
  authorAvatarUrl?: string;
  authorFirstName?: string;
  authorUserId?: number;
  menuItems?: FileMenuManager;
  isSelected?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  uploadProgress?: number;
  downloadProgress?: number;
}

const FileCard: React.FC<FileCardProps> = ({
  file,
  showPreview = false,
  showAuthorship = false,
  authorAvatarUrl,
  authorFirstName,
  authorUserId,
  menuItems,
  isSelected = false,
  onPress,
  onLongPress,
  uploadProgress,
  downloadProgress,
}) => {
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const canPreview = (isImage || isVideo) && showPreview;

  React.useEffect(() => {
    if (isVideo && showPreview && file.key) {
      // For videos, we'll use the key as URL if it's a full URL, otherwise skip thumbnail
      // In production, you might want to generate thumbnails server-side
      if (file.key.startsWith('http://') || file.key.startsWith('https://')) {
        // Try to generate thumbnail from video URL
        VideoThumbnails.getThumbnailAsync(file.key, {
          time: 1000,
        })
          .then(({ uri }) => setThumbnailUri(uri))
          .catch(() => setThumbnailUri(null));
      } else {
        setThumbnailUri(null);
      }
    } else if (isImage && showPreview && file.key) {
      // For images, use the key directly if it's a URL
      if (file.key.startsWith('http://') || file.key.startsWith('https://')) {
        setThumbnailUri(file.key);
      } else {
        setThumbnailUri(null);
      }
    } else if (!showPreview) {
      setThumbnailUri(null);
    }
  }, [isVideo, isImage, showPreview, file.key]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getFileIcon = () => {
    if (isImage) return 'image';
    if (isVideo) return 'video';
    if (file.mimeType?.includes('pdf')) return 'file-text';
    if (file.mimeType?.includes('zip') || file.mimeType?.includes('rar')) return 'archive';
    return 'file';
  };
  
  const progress = uploadProgress !== undefined ? uploadProgress : downloadProgress;

  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.containerSelected,
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
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather
              name={getFileIcon()}
              size={24}
              color={Colors.primary}
            />
          </View>
          <View style={styles.infoContainer}>
            <ThemedText style={styles.fileName} numberOfLines={1}>
              {file.storedName}
            </ThemedText>
            <ThemedText style={styles.fileMeta}>
              {formatFileSize(file.size)} • {file.downloadCount || 0} downloads
            </ThemedText>
          </View>
          {menuItems && (
          <>
            {menuItems && <ActionMenu items={menuItems.getMenuItems(file._id, file.storedName)} />}
          </>
          )}
        </View>

        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress}%` },
                ]}
              />
            </View>
            <ThemedText style={styles.progressText}>
              {Math.round(progress)}%
            </ThemedText>
          </View>
        )}

        {canPreview && thumbnailUri && (
          <TouchableOpacity
            style={styles.previewContainer}
            onPress={() => setShowFullPreview(true)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.previewImage}
              contentFit="cover"
            />
            {isVideo && (
              <View style={styles.playButton}>
                <Feather name="play" size={24} color={Colors.brightText} />
              </View>
            )}
          </TouchableOpacity>
        )}

        {showFullPreview && thumbnailUri && (
          <View style={styles.fullPreviewContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFullPreview(false)}
            >
              <Feather name="x" size={24} color={Colors.brightText} />
            </TouchableOpacity>
            <Image
              source={{ uri: thumbnailUri }}
              style={styles.fullPreviewImage}
              contentFit="contain"
            />
          </View>
        )}
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Feather name="check-circle" size={20} color={Colors.primary} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.inactive,
  },
  content: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: Colors.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 4,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brightText,
  },
  fileMeta: {
    fontSize: 12,
    color: Colors.secondary,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.inactive,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  progressText: {
    fontSize: 12,
    color: Colors.text,
    minWidth: 40,
    textAlign: 'right',
  },
  previewContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: Colors.inactive,
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullPreviewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullPreviewImage: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1001,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 4,
  },
});

export default FileCard;

