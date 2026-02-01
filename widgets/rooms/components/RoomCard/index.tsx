import { RoomItem } from "@/api/types/room";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import GradientView from "@/shared/Gradient";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface RoomCardProps {
  room: RoomItem;
  onPress: () => void;
  notificationCount?: number;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const RoomCard = ({ room, onPress, notificationCount = 0 }: RoomCardProps) => {
  const participants = room.participantsDetails || [];
  const fileCount = room.files?.length || 0;
  const totalSize = room.maxBytes || 0;
  const owner = participants.find((p) => p.role === "admin") || participants[0];
  const ownerName = owner?.profile?.firstName || room.owner || "Room";

  const description = "Please wait a moment while we prepare your experience";

  return (
    <TouchableOpacity onPress={onPress}>
    <GradientView colors={[Colors.border, Colors.cardBackground]} style={styles.container}>
      {notificationCount > 0 && (
        <View style={styles.notificationBadge}>
          <ThemedText style={styles.notificationText}>
            +{notificationCount} new File{notificationCount > 1 ? "s" : ""}
          </ThemedText>
        </View>
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="subtitle" style={styles.roomName}>
            {ownerName}
          </ThemedText>
        </View>

        {participants.length > 0 && (
          <View style={styles.participantsContainer}>
            {participants.slice(0, 3).map((participant, index) => (
              <View
                key={participant.userId}
                style={[
                  styles.avatarWrapper,
                  index > 0 && styles.avatarOverlap,
                ]}
              >
                <Avatar
                  size="small"
                  uri={participant.profile?.avatarUrl}
                  title={participant.profile?.firstName?.[0]?.toUpperCase() || "?"}
                />
              </View>
            ))}
            {participants.length > 3 && (
              <View style={[styles.avatarWrapper, styles.avatarOverlap, styles.moreAvatars]}>
                <ThemedText style={styles.moreText}>+{participants.length - 3}</ThemedText>
              </View>
            )}
          </View>
        )}

        <View style={styles.infoContainer}>
          <ThemedText style={styles.fileInfo}>
            Files {fileCount} • {formatBytes(totalSize)}
          </ThemedText>
        </View>

        <ThemedText style={styles.description} numberOfLines={2}>
          {description}
        </ThemedText>
      </View>
      </GradientView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 1,
  },
  notificationText: {
    color: Colors.brightText,
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    gap: 8,
  },
  header: {
    marginBottom: 4,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.brightText,
  },
  participantsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  avatarWrapper: {
    marginRight: -8,
  },
  avatarOverlap: {
    marginLeft: -8,
  },
  moreAvatars: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.inactive,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.cardBackground,
  },
  moreText: {
    fontSize: 10,
    color: Colors.brightText,
    fontWeight: "600",
  },
  infoContainer: {
    marginTop: 4,
  },
  fileInfo: {
    fontSize: 14,
    color: Colors.text,
  },
  description: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 4,
    lineHeight: 16,
  },
});

export default RoomCard;

