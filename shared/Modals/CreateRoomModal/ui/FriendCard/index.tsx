import { Colors } from "@/constants/design-tokens";
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
}

const FriendCard: React.FC<FriendCardProps> = ({
  id,
  firstName,
  avatarUrl,
  isSelected,
  disabled = false,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      onPress={() => onToggle(id)}
      style={[styles.friendItem, isSelected && styles.friendItemSelected]}
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
      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
        {isSelected && <Ionicons name="checkmark" size={16} color={Colors.brightText} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: Colors.inactive,
    marginBottom: 8,
    gap: 12,
  },
  friendItemSelected: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  friendText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  friendTextSelected: {
    color: Colors.brightText,
    fontWeight: "600",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.brightText,
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default FriendCard;
