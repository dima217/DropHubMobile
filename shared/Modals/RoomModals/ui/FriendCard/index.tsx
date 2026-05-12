import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FriendCardProps {
  id: number;
  firstName: string;
  avatarUrl?: string | null;
  isSelected: boolean;
  disabled?: boolean;
  onToggle: (id: number) => void;
  selectionColor: string;
}

const FriendCard: React.FC<FriendCardProps> = ({
  id,
  firstName,
  avatarUrl,
  isSelected,
  disabled = false,
  onToggle,
  selectionColor,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: c.inactive,
    marginBottom: 8,
    gap: 12,
  },
  friendItemSelected: {
    backgroundColor: c.cardBackground,
    borderWidth: 1,
  },
  friendText: {
    flex: 1,
    fontSize: 14,
    color: c.text,
  },
  friendTextSelected: {
    color: c.brightText,
    fontWeight: "600",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: c.secondary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  checkmark: {
    color: c.brightText,
    fontSize: 10,
    fontWeight: "bold",
  },

}));

  const checkboxColor = isSelected ? selectionColor : themeColors.secondary;
  const checkboxBackgroundColor = isSelected ? selectionColor : "transparent";
  return (
    <TouchableOpacity
      onPress={() => onToggle(id)}
      style={[styles.friendItem, isSelected && styles.friendItemSelected, { borderColor: selectionColor }]}
      disabled={disabled}
    >
      <Avatar
        size="small"
        uri={avatarUrl || undefined}
        title={firstName[0]?.toUpperCase() || "?"}
      />
      <ThemedText style={[styles.friendText, isSelected && styles.friendTextSelected]}>
        {firstName}
      </ThemedText>
      <View style={[styles.checkbox, { borderColor: checkboxColor, backgroundColor: checkboxBackgroundColor }]}>
        {isSelected && <Ionicons name="checkmark" size={16} color={themeColors.brightText} />}
      </View>
    </TouchableOpacity>
  );
};

export default FriendCard;
