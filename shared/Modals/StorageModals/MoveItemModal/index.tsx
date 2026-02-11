import { useGetStorageStructureQuery } from "@/api/storageApi";
import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface MoveItemModalProps {
  visible: boolean;
  itemId: string;
  storageId: string;
  currentParentId: string | null;
  onClose: () => void;
  onConfirm: (newParentId: string | null) => void;
}

const MoveItemModal: React.FC<MoveItemModalProps> = ({
  visible,
  itemId,
  storageId,
  currentParentId,
  onClose,
  onConfirm,
}) => {
  const { data: structure, isLoading } = useGetStorageStructureQuery(
    { storageId },
    { skip: !storageId || !visible }
  );
  const [selectedParentId, setSelectedParentId] = useState<string | null>(
    currentParentId
  );

  // Filter out the item being moved and its children
  const availableFolders = React.useMemo(() => {
    if (!structure) return [];
    const folders = structure.filter(
      (item) =>
        item.isDirectory &&
        item.id !== itemId &&
        !item.deletedAt &&
        !isDescendant(item.id, itemId, structure)
    );
    return folders;
  }, [structure, itemId]);

  const handleSelectFolder = (folderId: string | null) => {
    setSelectedParentId(folderId);
  };

  const handleConfirm = () => {
    onConfirm(selectedParentId);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Переместить</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.brightText} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.folderItem,
                  selectedParentId === null && styles.folderItemSelected,
                ]}
                onPress={() => handleSelectFolder(null)}
              >
                <Feather name="folder" size={24} color={Colors.primary} />
                <ThemedText style={styles.folderName}>Корень</ThemedText>
                {selectedParentId === null && (
                  <Feather name="check-circle" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>

              <FlatList
                data={availableFolders}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedParentId === item.id;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.folderItem,
                        isSelected && styles.folderItemSelected,
                      ]}
                      onPress={() => handleSelectFolder(item.id)}
                    >
                      <Feather name="folder" size={24} color={Colors.primary} />
                      <ThemedText style={styles.folderName}>
                        {item.name}
                      </ThemedText>
                      {isSelected && (
                        <Feather
                          name="check-circle"
                          size={20}
                          color={Colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
                contentContainerStyle={styles.listContent}
              />
            </>
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <ThemedText style={styles.cancelButtonText}>Отмена</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[styles.button, styles.confirmButton]}
            >
              <ThemedText style={styles.confirmButtonText}>
                Переместить
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Helper function to check if a folder is a descendant of another
function isDescendant(
  folderId: string,
  ancestorId: string,
  structure: StorageItem[]
): boolean {
  const folder = structure.find((item) => item.id === folderId);
  if (!folder || !folder.parentId) return false;
  if (folder.parentId === ancestorId) return true;
  return isDescendant(folder.parentId, ancestorId, structure);
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.brightText,
  },
  closeButton: {
    padding: 4,
  },
  center: {
    padding: 40,
    alignItems: "center",
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    marginBottom: 8,
    gap: 12,
  },
  folderItemSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  folderName: {
    flex: 1,
    fontSize: 16,
    color: Colors.brightText,
  },
  listContent: {
    paddingBottom: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  cancelButtonText: {
    color: Colors.brightText,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: Colors.brightText,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MoveItemModal;

