import { Colors } from '@/constants/design-tokens';
import { ThemedText } from '@/shared/core/ThemedText';
import ActionMenu from '@/shared/ui/ActionMenu';
import { ActionMenuItemData } from '@/shared/ui/ActionMenu/ActionMenuItem';
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
  onPress?: () => void;
  onLongPress?: () => void;
  tags?: string[];
  tagColors?: Record<string, string>;
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
  onPress,
  onLongPress,
  tags = [],
  tagColors = {},
}) => {
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
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Feather
              name="folder"
              size={24}
              color={Colors.primary}
            />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
            <ThemedText style={styles.folderName} numberOfLines={1}>
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
    gap: 2,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brightText,
  },
  tagsRow: {
    flexDirection: 'row',
    marginTop: 2,
    marginBottom: 2,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.secondary}20`,
    borderWidth: 1,
    borderColor: Colors.secondary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 4,
  },
  tagBadgeText: {
    fontSize: 10,
    color: Colors.secondary,
    fontWeight: '600',
  },
  folderMeta: {
    fontSize: 12,
    color: Colors.secondary,
  },
  favoriteIndicator: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 4,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default FolderCard;
