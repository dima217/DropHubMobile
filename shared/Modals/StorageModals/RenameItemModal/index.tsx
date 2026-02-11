import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import TextInput from "@/shared/TextInput";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface RenameItemModalProps {
  visible: boolean;
  currentName: string;
  onClose: () => void;
  onConfirm: (newName: string) => void;
}

const RenameItemModal: React.FC<RenameItemModalProps> = ({
  visible,
  currentName,
  onClose,
  onConfirm,
}) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    if (visible) {
      setNewName(currentName);
    }
  }, [visible, currentName]);

  const handleConfirm = () => {
    if (newName.trim() && newName.trim() !== currentName) {
      onConfirm(newName.trim());
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Переименовать</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.brightText} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <ThemedText style={styles.label}>Новое название:</ThemedText>
            <TextInput
              value={newName}
              onChangeText={setNewName}
              placeholder="Введите название"
              style={styles.input}
              autoFocus
            />
          </View>

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
              disabled={!newName.trim() || newName.trim() === currentName}
            >
              <ThemedText style={styles.confirmButtonText}>Сохранить</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: "85%",
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
  content: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 8,
  },
  input: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
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

export default RenameItemModal;

