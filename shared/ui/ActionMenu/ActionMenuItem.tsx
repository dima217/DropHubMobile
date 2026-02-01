import { Colors } from "@/constants/design-tokens";
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
              ? Colors.secondary
              : item.destructive
              ? Colors.reject
              : Colors.primary
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

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
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
    backgroundColor: Colors.inactive,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerDestructive: {
    backgroundColor: `${Colors.reject}20`,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: Colors.brightText,
  },
  labelDestructive: {
    color: Colors.reject,
  },
  labelDisabled: {
    color: Colors.secondary,
  },
});

export default ActionMenuItem;

