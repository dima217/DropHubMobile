import {
  useGetSharedItemParticipantsQuery,
  useRevokePermissionsMutation,
} from "@/api/sharedApi";
import { AccessRole } from "@/api/types/room";
import { ResourceType } from "@/api/types/shared";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

interface PermissionsModalProps {
  visible: boolean;
  itemId: string;
  onClose: () => void;
  storageId?: string;
  onPermissionsChanged?: () => void;
}

const roleLabels: Record<AccessRole, string> = {
  [AccessRole.READ]: "Чтение",
  [AccessRole.WRITE]: "Запись",
  [AccessRole.ADMIN]: "Администратор",
};

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  visible,
  itemId,
  onClose,
  storageId,
  onPermissionsChanged,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: c.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: c.brightText,
  },
  closeButton: {
    padding: 4,
  },
  center: {
    padding: 40,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: c.cardBackground,
    marginBottom: 8,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  participantInfo: {
    flex: 1,
    gap: 4,
  },
  participantName: {
    fontSize: 16,
    fontWeight: "600",
    color: c.brightText,
  },
  participantEmail: {
    fontSize: 12,
    color: c.secondary,
  },
  participantRole: {
    fontSize: 12,
    color: c.primary,
  },
  revokeButton: {
    padding: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: c.secondary,
    fontSize: 14,
  },

}));

  const { data: participants, isLoading, refetch } = useGetSharedItemParticipantsQuery(
    { itemId },
    { skip: !itemId || !visible }
  );
  const [revokePermissions] = useRevokePermissionsMutation();

  const handleRevoke = async (userId: number, role: AccessRole) => {
    if (!storageId) return;
    try {
      await revokePermissions({
        storageId,
        resourceId: itemId,
        resourceType: ResourceType.SHARED,
        targetUserId: userId,
        role,
      }).unwrap();
      void refetch();
      onPermissionsChanged?.();
    } catch (error) {
      console.error("Failed to revoke permissions:", error);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Права доступа</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={themeColors.brightText} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={participants || []}
              keyExtractor={(item) => item.userId.toString()}
              renderItem={({ item }) => (
                <View style={styles.participantItem}>
                  <Image
                    source={{ uri: item.profile.avatarUrl }}
                    style={styles.avatar}
                    contentFit="cover"
                  />
                  <View style={styles.participantInfo}>
                    <ThemedText style={styles.participantName}>
                      {item.profile.firstName}
                    </ThemedText>
                    <ThemedText style={styles.participantEmail}>
                      {item.email}
                    </ThemedText>
                    <ThemedText style={styles.participantRole}>
                      {roleLabels[item.role]}
                    </ThemedText>
                  </View>
                  {storageId && (
                    <TouchableOpacity
                      onPress={() => handleRevoke(item.userId, item.role)}
                      style={styles.revokeButton}
                    >
                      <Feather name="x-circle" size={20} color={themeColors.reject} />
                    </TouchableOpacity>
                  )}
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>
                    Нет пользователей с доступом
                  </ThemedText>
                </View>
              }
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PermissionsModal;
