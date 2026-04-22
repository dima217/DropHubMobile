import { Colors } from "@/constants/design-tokens";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/shared/core/ThemedText";

type SharedUser = {
  userId: number;
  email: string | null;
  profile: {
    firstName: string;
    avatarUrl: string | null;
  } | null;
};

interface SharedUsersPreviewProps {
  users?: SharedUser[];
  maxVisible?: number;
}

const getPrimaryLabel = (user: SharedUser): string => {
  const byName = user.profile?.firstName?.trim();
  if (byName) return byName;
  const byEmail = user.email?.trim();
  if (byEmail) return byEmail;
  return `User #${user.userId}`;
};

const SharedUsersPreview: React.FC<SharedUsersPreviewProps> = ({
  users = [],
  maxVisible = 3,
}) => {
  if (!users.length) return null;

  const visible = users.slice(0, maxVisible);
  const rest = users.length - visible.length;

  return (
    <View style={styles.container}>
      <Feather name="user" size={13} color={Colors.secondary} />
      <View style={styles.avatarsRow}>
        {visible.map((user, index) => {
          const label = getPrimaryLabel(user);
          const initial = label.charAt(0).toUpperCase() || "?";
          return (
            <View
              key={user.userId}
              style={[styles.avatarWrapper, index > 0 && styles.avatarOverlap]}
            >
              <Avatar
                size="small"
                uri={user.profile?.avatarUrl || undefined}
                title={initial}
              />
            </View>
          );
        })}
        {rest > 0 && (
          <View style={[styles.avatarWrapper, styles.avatarOverlap, styles.more]}>
            <ThemedText style={styles.moreText}>{`+${rest}`}</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 6,
  },
  avatarsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrapper: {
    marginRight: -8,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  more: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.inactive,
    borderWidth: 2,
    borderColor: Colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: {
    fontSize: 10,
    color: Colors.brightText,
    fontWeight: "600",
  },
});

export default SharedUsersPreview;
