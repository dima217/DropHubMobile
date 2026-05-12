import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";

export interface ActionMenuItemData {
  id: string;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
  disabled?: boolean;
}

interface ActionMenuItemProps {
  item: ActionMenuItemData;
  onPress: () => void;
}

const ActionMenuItem: React.FC<ActionMenuItemProps> = ({ item, onPress }) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: c.cardBackground,
    marginBottom: 8,
    gap: 12,
  },
  itemDisabled: {
    opacity: 0.5,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: c.inactive,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerDestructive: {
    backgroundColor: `${c.reject}20`,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: c.brightText,
  },
  labelDestructive: {
    color: c.reject,
  },
  labelDisabled: {
    color: c.secondary,
  },

}));

  return (
    <TouchableOpacity
      style={[
        styles.item,
        item.disabled && styles.itemDisabled,
      ]}
      onPress={onPress}
      disabled={item.disabled}
    >
      <View
        style={[
          styles.iconContainer,
          item.destructive && styles.iconContainerDestructive,
        ]}
      >
        <Feather
          name={item.icon}
          size={20}
          color={
            item.disabled
              ? themeColors.secondary
              : item.destructive
              ? themeColors.reject
              : themeColors.primary
          }
        />
      </View>
      <ThemedText
        style={[
          styles.label,
          item.destructive && styles.labelDestructive,
          item.disabled && styles.labelDisabled,
        ]}
      >
        {item.label}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default ActionMenuItem;
