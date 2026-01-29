import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ConnectionCardProps {
  avatarUrl?: string;
  firstName: string;
  onPress: () => void;
}

const ConnectionCard = ({
  avatarUrl,
  firstName,
  onPress,
}: ConnectionCardProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Avatar
        size="small"
        uri={avatarUrl}
        title={firstName[0]?.toUpperCase() || "?"}
      />
      <ThemedText type="subtitle">{firstName}</ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
  },
});

export default ConnectionCard;
