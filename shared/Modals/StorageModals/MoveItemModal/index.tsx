import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface MoveItemModalProps {
  visible: boolean;
  currentParentId: string | null;
  onClose: () => void;
  onConfirm: (newParentId: string | null) => void;
  /** Текущая папка назначения совпадает с перемещаемой папкой — в эту папку нельзя */
  moveIntoSelfBlocked?: boolean;
}

const MoveItemModal: React.FC<MoveItemModalProps> = ({
  visible,
  currentParentId,
  onClose,
  onConfirm,
  moveIntoSelfBlocked = false,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  overlay: {},
  container: {
    backgroundColor: c.background,
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
    color: c.brightText,
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
    color: c.secondary,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 13,
    color: c.reject,
    marginBottom: 12,
    lineHeight: 18,
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
    backgroundColor: c.cardBackground,
    borderWidth: 1,
    borderColor: c.border,
  },
  confirmButton: {
    backgroundColor: c.primary,
  },
  confirmButtonDisabled: {
    opacity: 0.45,
  },
  confirmButtonTextDisabled: {
    opacity: 0.9,
  },
  cancelButtonText: {
    color: c.brightText,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: c.brightText,
    fontSize: 16,
    fontWeight: "600",
  },

}));

  const handleConfirm = () => {
    if (moveIntoSelfBlocked) return;
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
                <Feather name="x" size={24} color={themeColors.brightText} />
              </TouchableOpacity>
            </View>

            <ThemedText style={styles.description}>
              Выберите нужную папку в хранилище, затем нажмите «Переместить».
            </ThemedText>
            {moveIntoSelfBlocked ? (
              <ThemedText style={styles.warningText}>
                Сейчас выбрана папка назначения, в которую нельзя переместить этот
                элемент (например, сама перемещаемая папка). Откройте другую папку
                в хлебных крошках.
              </ThemedText>
            ) : null}

            <View style={styles.footer}>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.button, styles.cancelButton]}
              >
                <ThemedText style={styles.cancelButtonText}>Отмена</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                disabled={moveIntoSelfBlocked}
                style={[
                  styles.button,
                  styles.confirmButton,
                  moveIntoSelfBlocked && styles.confirmButtonDisabled,
                ]}
              >
                <ThemedText
                  style={[
                    styles.confirmButtonText,
                    moveIntoSelfBlocked && styles.confirmButtonTextDisabled,
                  ]}
                >
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

export default MoveItemModal;
