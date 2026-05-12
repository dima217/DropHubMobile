import { Friend } from "@/api/types/friend";
import { AccessRole, RoomItem } from "@/api/types/room";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import GradientView from "@/shared/Gradient";
import { useI18n } from "@/shared/localization";
import ManageUsersModal from "@/shared/Modals/RoomModals/ManageUsersModal";
import UpdateRoomModal from "@/shared/Modals/RoomModals/UpdateRoomModal";
import ActionMenu from "@/shared/ui/ActionMenu";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import { useRoomActionMenu } from "@/widgets/rooms/hooks/useRoomActionMenu";
import { getManagedUsers } from "@/widgets/rooms/utils";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View, type ViewStyle } from "react-native";

interface RoomCardProps {
  room: RoomItem;
  friends: Friend[];
  onPress: () => void;
  notificationCount?: number;
  onRefresh?: () => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const RoomCard = ({ room, friends, onPress, notificationCount = 0, onRefresh }: RoomCardProps) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    backgroundColor: c.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  containerArchived: {
    opacity: 0.85,
  },
  archivedBadge: {
    backgroundColor: c.secondary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  archivedText: {
    color: c.brightText,
    fontSize: 11,
    fontWeight: "600",
  },
  notificationBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: c.primary,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    zIndex: 1,
  },
  notificationText: {
    color: c.brightText,
    fontSize: 11,
    fontWeight: "600",
  },
  content: {
    gap: 8,
  },
  header: {
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  roomName: {
    fontSize: 18,
    fontWeight: "600",
    color: c.brightText,
  },
  roomNameArchived: {
    color: c.secondary,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    backgroundColor: c.inactive,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: c.cardBackground,
  },
  moreText: {
    fontSize: 10,
    color: c.brightText,
    fontWeight: "600",
  },
  infoContainer: {
    marginTop: 4,
  },
  fileInfo: {
    fontSize: 14,
    color: c.text,
  },
  description: {
    fontSize: 12,
    color: c.secondary,
    marginTop: 4,
    lineHeight: 16,
  },

}));

  const { tl } = useI18n();
  const router = useRouter();
  const participants = room.participantsDetails || [];
  const fileCount = room.files?.length || 0;
  const totalSize = room.maxBytes || 0;
  const ownerName = room.owner || "Room";

  const {
    openManageUsersModal,
    manageUsersMode,
    setOpenManageUsersModal,
    handleConfirmManageUsers,
    items,
    openEditRoomModal,
    setOpenEditRoomModal,
    handleConfirmEditRoom,
  } = useRoomActionMenu({
    room,
    onRefresh,
    onNavigateToArchive: (roomId) => {
      router.push({ pathname: "/(tabs)/storage", params: { archiveRoomId: roomId } });
    },
  });


  const description = tl("Please wait a moment while we prepare your experience");
  const managedUsers = getManagedUsers(friends, participants, manageUsersMode as 'add' | 'remove');

  return (
    <TouchableOpacity onPress={onPress}>
    <GradientView
      colors={[themeColors.border, themeColors.cardBackground]}
      locations={[0, 0.5]}
      style={(room.archived ? [styles.container, styles.containerArchived] : styles.container) as ViewStyle}
    >
      {notificationCount > 0 && !room.archived && (
        <View style={styles.notificationBadge}>
          <ThemedText style={styles.notificationText}>
            +{notificationCount} {notificationCount > 1 ? tl("new Files") : tl("new File")}
          </ThemedText>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText
            type="subtitle"
            style={room.archived && room.userRole === AccessRole.ADMIN ? [styles.roomName, styles.roomNameArchived] : styles.roomName}
          >
            {ownerName}
          </ThemedText>
          <View style={styles.headerRight}>
            {room.archived && room.userRole === AccessRole.ADMIN && (
              <View style={styles.archivedBadge}>
                <ThemedText style={styles.archivedText}>Архив</ThemedText>
              </View>
            )}
            {room.userRole === AccessRole.ADMIN && (
              <View pointerEvents="box-none">
                <ActionMenu items={items} title={tl("Room Actions")} />
              </View>
            )}
          </View>
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
            {tl("Files")} {fileCount} • {formatBytes(totalSize)}
          </ThemedText>
        </View>

        <ThemedText style={styles.description} numberOfLines={2}>
          {description}
        </ThemedText>
      </View>
      </GradientView>
      <ManageUsersModal
        isVisible={openManageUsersModal}
        onClose={() => setOpenManageUsersModal(false)}
        mode={manageUsersMode}
        users={managedUsers}
        roomId={room.id}
        onConfirm={handleConfirmManageUsers}
      />
      <UpdateRoomModal
        visible={openEditRoomModal}
        roomId={room.id}
        owner={room.owner}
        onClose={() => setOpenEditRoomModal(false)}
        onUpdate={handleConfirmEditRoom}
      />
    </TouchableOpacity>
  );
};

export default RoomCard;
