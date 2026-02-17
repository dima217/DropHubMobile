import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface MoveItemModalProps {
  visible: boolean;
  currentParentId: string | null;
  onClose: () => void;
  onConfirm: (newParentId: string | null) => void;
}

const MoveItemModal: React.FC<MoveItemModalProps> = ({
  visible,
  currentParentId,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    onConfirm(currentParentId);
    onClose();
  };

  return (
    <>
      {!visible ? null : (
        <View pointerEvents="box-none" style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <ThemedText style={styles.title}>Переместить</ThemedText>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color={Colors.brightText} />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.description}>
              Выберите нужную папку в хранилище, затем нажмите «Переместить».
            </ThemedText>

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
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {},
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
  description: {
    fontSize: 14,
    color: Colors.secondary,
    marginBottom: 16,
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

