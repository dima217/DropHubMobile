import { FileItem } from '@/api/types/file';
import { Colors } from '@/constants/design-tokens';
import { ThemedText } from '@/shared/core/ThemedText';
import { ActionMenuItemData } from '@/shared/ui/ActionMenu/ActionMenuItem';
import PreviewToggleSwitch from '@/shared/ui/PreviewToggleSwitch';
import React, { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { FileMenuManager } from '../../menu/fileMenu';
import FileCard from '../FileCard';
import FolderCard from '../FolderCard';

export interface ResourceItem {
  id: string;
  type: 'file' | 'folder';
  file?: FileItem;
  folderId?: string;
  folderName?: string;
  itemCount?: number;
  authorAvatarUrl?: string;
  authorFirstName?: string;
  authorUserId?: number;
  uploadProgress?: number;
  downloadProgress?: number;
}

interface ResourcesSectionProps {
  resources: ResourceItem[];
  /** Pass from room screen so file previews can resolve signed URLs when `file.key` is not a public URL */
  roomId?: string;
  showAuthorship?: boolean;
  fileMenuItems?: FileMenuManager;
  folderMenuItems?: ActionMenuItemData[];
  onFilePress?: (file: FileItem) => void;
  onFileLongPress?: (file: FileItem) => void;
  onFolderPress?: (folderId: string) => void;
  onFolderLongPress?: (folderId: string) => void;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  isMultiSelectMode?: boolean;
}

const ResourcesSection: React.FC<ResourcesSectionProps> = ({
  resources,
  roomId,
  showAuthorship = false,
  fileMenuItems,
  folderMenuItems = [],
  onFilePress,
  onFileLongPress,
  onFolderPress,
  onFolderLongPress,
  selectedIds = new Set(),
  onSelectionChange,
  isMultiSelectMode = false,
}) => {
  const [previewEnabled, setPreviewEnabled] = useState(false);
  const handleFilePress = (file: FileItem) => {
    if (onFilePress) {
      onFilePress(file);
    }
  };

  const handleFileLongPress = (file: FileItem) => {
    if (onFileLongPress) {
      onFileLongPress(file);
    } else if (onSelectionChange) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(file._id)) {
        newSelected.delete(file._id);
      } else {
        newSelected.add(file._id);
      }
      onSelectionChange(newSelected);
    }
  };

  const handleFolderPress = (folderId: string) => {
    if (onFolderPress) {
      onFolderPress(folderId);
    }
  };

  const handleFolderLongPress = (folderId: string) => {
    if (onFolderLongPress) {
      onFolderLongPress(folderId);
    } else if (onSelectionChange) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(folderId)) {
        newSelected.delete(folderId);
      } else {
        newSelected.add(folderId);
      }
      onSelectionChange(newSelected);
    }
  };

  const renderItem = ({ item }: { item: ResourceItem }) => {
    if (item.type === 'file' && item.file) {
      return (
        <FileCard
          file={item.file}
          roomId={roomId}
          showPreview={previewEnabled}
          showAuthorship={showAuthorship}
          authorAvatarUrl={item.authorAvatarUrl}
          authorFirstName={item.authorFirstName}
          authorUserId={item.authorUserId}
          menuItems={fileMenuItems}
          isSelected={selectedIds.has(item.file._id)}
          onPress={() => handleFilePress(item.file!)}
          onLongPress={() => handleFileLongPress(item.file!)}
          uploadProgress={item.uploadProgress}
          downloadProgress={item.downloadProgress}
        />
      );
    } else if (item.type === 'folder') {
      return (
        <FolderCard
          folderId={item.folderId!}
          folderName={item.folderName || 'Untitled Folder'}
          itemCount={item.itemCount || 0}
          showAuthorship={showAuthorship}
          authorAvatarUrl={item.authorAvatarUrl}
          authorFirstName={item.authorFirstName}
          authorUserId={item.authorUserId}
          menuItems={folderMenuItems}
          isSelected={selectedIds.has(item.folderId!)}
          onPress={() => handleFolderPress(item.folderId!)}
          onLongPress={() => handleFolderLongPress(item.folderId!)}
        />
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Resources</ThemedText>
        <PreviewToggleSwitch
          isEnabled={previewEnabled}
          onToggle={setPreviewEnabled}
        />
      </View>

      <FlatList
        data={resources}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.brightText,
  },
  listContent: {
    paddingVertical: 16,
  },
});

export default ResourcesSection;
