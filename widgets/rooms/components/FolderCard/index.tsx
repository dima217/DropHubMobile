import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from '@/shared/core/ThemedText';
import SharedUsersPreview from '@/shared/ui/SharedUsersPreview';
import ActionMenu from '@/shared/ui/ActionMenu';
import { ActionMenuItemData } from '@/shared/ui/ActionMenu/ActionMenuItem';
import type { StorageSharedWithUser } from '@/api/types/storage';
import AuthorshipSection from '@/shared/ui/AuthorshipSection';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

interface FolderCardProps {
  folderId: string;
  folderName: string;
  itemCount: number;
  showAuthorship?: boolean;
  authorAvatarUrl?: string;
  authorFirstName?: string;
  authorUserId?: number;
  menuItems?: ActionMenuItemData[];
  isSelected?: boolean;
  isFavorite?: boolean;
  /** When true, folder card is visually dimmed and not clickable */
  disabled?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  tags?: string[];
  tagColors?: Record<string, string>;
  sharedWith?: StorageSharedWithUser[];
}

const FolderCard: React.FC<FolderCardProps> = ({
  folderId,
  folderName,
  itemCount,
  showAuthorship = false,
  authorAvatarUrl,
  authorFirstName,
  authorUserId,
  menuItems = [],
  isSelected = false,
  isFavorite = false,
  disabled = false,
  onPress,
  onLongPress,
  tags = [],
  tagColors = {},
  sharedWith = [],
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    backgroundColor: c.cardBackground,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: c.border,
  },
  containerSelected: {
    borderColor: c.primary,
    backgroundColor: c.inactive,
  },
  containerDisabled: {
    opacity: 0.5,
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
    backgroundColor: c.inactive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 2,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
    color: c.brightText,
  },
  folderNameDisabled: {
    color: c.secondary,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${c.secondary}20`,
    borderWidth: 1,
    borderColor: c.secondary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  tagBadgeText: {
    fontSize: 10,
    color: c.secondary,
    fontWeight: '600',
  },
  folderMeta: {
    fontSize: 12,
    color: c.secondary,
  },
  favoriteIndicator: {
    backgroundColor: c.cardBackground,
    borderRadius: 12,
    padding: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: c.cardBackground,
    borderRadius: 12,
    padding: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

}));

  const primaryTagColor = tags.length > 0
    ? tags.map((t) => tagColors[t]).find(Boolean) || undefined
    : undefined;

  return (
    <Pressable
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        disabled && styles.containerDisabled,
        primaryTagColor ? { borderColor: primaryTagColor } : null,
      ]}
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
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
              name="folder"
              size={24}
                color={disabled ? themeColors.secondary : themeColors.primary}
            />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <ThemedText
                style={[
                  styles.folderName,
                  disabled && styles.folderNameDisabled,
                ]}
                numberOfLines={1}
              >
              {folderName}
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
                        ? { backgroundColor: `${tagColors[tag]}20`, borderColor: tagColors[tag] }
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
            <ThemedText style={styles.folderMeta}>
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </ThemedText>
          </View>
          {menuItems.length > 0 && (
            <ActionMenu items={menuItems} />
          )}
        </View>
      </View>

      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Feather name="check-circle" size={20} color={themeColors.primary} />
        </View>
      )}
    </Pressable>
  );
};

export default FolderCard;
