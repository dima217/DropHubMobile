import { Colors } from "@/constants/design-tokens";
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
        buttonColor={Colors.primary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: Colors.cardBackground,
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
});

export default FriendCard;

