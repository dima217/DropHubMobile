import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface FriendCardProps {
  avatarUrl?: string;
  firstName: string;
  onPress?: () => void;
  onShareResource: () => void;
}

const FriendCard = ({
  avatarUrl,
  firstName,
  onPress,
  onShareResource,
}: FriendCardProps) => {
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
  shareButton: {
    width: 160,
    height: 36,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 12,
  },

}));

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
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
      <Button
        title="Поделиться ресурсом"
        onPress={onShareResource}
        style={styles.shareButton}
        textStyle={styles.buttonText}
        buttonColor={themeColors.primary}
      />
    </TouchableOpacity>
  );
};

export default FriendCard;
