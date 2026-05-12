import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FriendRequestCardProps {
  avatarUrl?: string;
  firstName: string;
  onPress?: () => void;
  onAccept: () => void;
  onReject: () => void;
  isLoading?: boolean;
}

const FriendRequestCard = ({
  avatarUrl,
  firstName,
  onPress,
  onAccept,
  onReject,
  isLoading = false,
}: FriendRequestCardProps) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: c.cardBackground,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  name: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  acceptButton: {
    width: 90,
    height: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  rejectButton: {
    width: 90,
    height: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 14,
  },

}));

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.container}
      disabled={isLoading}
    >
      <View style={styles.content}>
        <Avatar
          size="small"
          uri={avatarUrl}
          title={firstName[0]?.toUpperCase() || "?"}
        />
        <ThemedText type="subtitle" style={styles.name}>
          {firstName}
        </ThemedText>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title="Принять"
          onPress={onAccept}
          loading={isLoading}
          style={styles.acceptButton}
          textStyle={styles.buttonText}
          buttonColor={themeColors.primary}
        />
        <Button
          title="Отклонить"
          onPress={onReject}
          loading={isLoading}
          style={styles.rejectButton}
          textStyle={styles.buttonText}
          buttonColor={themeColors.reject}
        />
      </View>
    </TouchableOpacity>
  );
};

export default FriendRequestCard;
