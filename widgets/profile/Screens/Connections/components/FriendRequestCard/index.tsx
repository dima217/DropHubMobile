import { Colors } from "@/constants/design-tokens";
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
          buttonColor={Colors.primary}
        />
        <Button
          title="Отклонить"
          onPress={onReject}
          loading={isLoading}
          style={styles.rejectButton}
          textStyle={styles.buttonText}
          buttonColor={Colors.reject}
        />
      </View>
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
});

export default FriendRequestCard;

