import { FileItem } from '@/api/types/file';
import type { StorageSharedWithUser } from '@/api/types/storage';
import { Colors } from '@/constants/design-tokens';
import { ThemedText } from '@/shared/core/ThemedText';
import { useI18n } from '@/shared/localization';
import ActionMenu from '@/shared/ui/ActionMenu';
import SharedUsersPreview from '@/shared/ui/SharedUsersPreview';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { FileMenuManager } from '../../../../menu/fileMenu';
import { styles } from '../../styles';
import { formatFileSize, getFileIconName } from '../../utils';

interface HeaderProps {
  file: FileItem;
  isImage: boolean;
  isVideo: boolean;
  isFavorite: boolean;
  isSelected: boolean;
  menuItems?: FileMenuManager;
  tags: string[];
  tagColors: Record<string, string>;
  sharedWith?: StorageSharedWithUser[];
}

const Header = ({
  file,
  isImage,
  isVideo,
  isFavorite,
  isSelected,
  menuItems,
  tags,
  tagColors,
  sharedWith = [],
}: HeaderProps) => {
  const { t } = useI18n();
  const iconName = getFileIconName(file.mimeType, isImage, isVideo);

  return (
    <View style={styles.header}>
      <View style={styles.iconContainer}>
        <Feather name={iconName} size={24} color={Colors.primary} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <ThemedText style={styles.fileName} numberOfLines={1}>
            {file.storedName}
          </ThemedText>
          {isFavorite && !isSelected && (
            <View style={styles.favoriteIndicator}>
              <Feather name="star" size={14} color="#FFD700" />
            </View>
          )}
        </View>
        {tags.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tagsRow}
          >
            {tags.map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tagBadge,
                  tagColors[tag]
                    ? {
                        backgroundColor: `${tagColors[tag]}20`,
                        borderColor: tagColors[tag],
                      }
                    : null,
                ]}
              >
                <ThemedText
                  style={[
                    styles.tagBadgeText,
                    tagColors[tag] ? { color: tagColors[tag] } : null,
                  ]}
                >
                  #{tag}
                </ThemedText>
              </View>
            ))}
          </ScrollView>
        )}
        <SharedUsersPreview users={sharedWith} />
        <ThemedText style={styles.fileMeta}>
          {formatFileSize(file.size)} · {file.downloadCount ?? 0} {t("storage.file.downloadsShort")}
        </ThemedText>
      </View>
      {menuItems && (
        <ActionMenu
          items={menuItems.getMenuItems(file._id, file.storedName, file.mimeType)}
        />
      )}
    </View>
  );
};

export default Header;
