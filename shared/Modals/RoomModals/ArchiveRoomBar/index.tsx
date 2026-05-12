import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ArchiveRoomBarProps {
  visible: boolean;
  /** Custom description. If not set, uses roomName-based or default text */
  description?: string;
  roomName?: string;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const ArchiveRoomBar: React.FC<ArchiveRoomBarProps> = ({
  visible,
  description: descriptionProp,
  roomName,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {},
        container: {
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          padding: 20,
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        },
        title: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.brightText,
        },
        closeButton: {
          padding: 4,
        },
        description: {
          fontSize: 14,
          color: colors.secondary,
          marginBottom: 16,
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
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
        },
        confirmButton: {
          backgroundColor: colors.primary,
        },
        cancelButtonText: {
          color: colors.brightText,
          fontSize: 16,
          fontWeight: "600",
        },
        confirmButtonText: {
          color: "#FFFFFF",
          fontSize: 16,
          fontWeight: "600",
        },
      }),
    [colors]
  );

  if (!visible) return null;

  const description =
    descriptionProp ??
    (roomName
      ? `Комната «${roomName}» будет помечена как архивированная.`
      : "Комната будет помечена как архивированная.");

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Архивировать комнату</ThemedText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={isLoading}>
            <Feather name="x" size={24} color={colors.brightText} />
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.description}>
          {description}
        </ThemedText>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.button, styles.cancelButton]}
            disabled={isLoading}
          >
            <ThemedText style={styles.cancelButtonText}>Отмена</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onConfirm}
            style={[styles.button, styles.confirmButton]}
            disabled={isLoading}
          >
            <ThemedText style={styles.confirmButtonText}>
              {isLoading ? "..." : "Архивировать"}
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
