import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        },
        title: {
          fontSize: 20,
          fontWeight: "600",
          color: colors.brightText,
        },
        closeButton: {
          padding: 4,
        },
      }),
    [colors.brightText]
  );

  return (
    <View style={styles.header}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Feather name="x" size={24} color={colors.brightText} />
      </TouchableOpacity>
    </View>
  );
};
