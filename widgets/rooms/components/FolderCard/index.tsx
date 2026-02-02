import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from '@/shared/core/ThemedText';
import { Colors } from '@/constants/design-tokens';
import ActionMenu, { ActionMenuItemData } from '@/shared/ui/ActionMenu';
import AuthorshipSection from '@/shared/ui/AuthorshipSection';
import { Feather } from '@expo/vector-icons';

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
  onPress?: () => void;
  onLongPress?: () => void;
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
  onPress,
  onLongPress,
}) => {
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
              name="folder"
              size={24}
              color={Colors.primary}
            />
          </View>
          <View style={styles.infoContainer}>
            <ThemedText style={styles.folderName} numberOfLines={1}>
              {folderName}
            </ThemedText>
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
    gap: 4,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.brightText,
  },
  folderMeta: {
    fontSize: 12,
    color: Colors.secondary,
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

export default FolderCard;

