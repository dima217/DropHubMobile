import { useGetFriendsQuery } from "@/api/friendApi";
import { AccessRole } from "@/api/types/room";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface GrantAccessModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFriend: (friendId: number, role: AccessRole) => void;
}

const GrantAccessModal: React.FC<GrantAccessModalProps> = ({
  visible,
  onClose,
  onSelectFriend,
}) => {
  const { data: friends, isLoading } = useGetFriendsQuery();
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<AccessRole>(AccessRole.WRITE);

  const handleSelectFriend = (friendId: number) => {
    setSelectedFriendId(friendId);
  };

  const handleConfirm = () => {
    if (selectedFriendId) {
      onSelectFriend(selectedFriendId, selectedRole);
      setSelectedFriendId(null);
      setSelectedRole(AccessRole.WRITE);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <ThemedText style={styles.title}>Выдать доступ</ThemedText>
              <ThemedText style={styles.subtitle}>
                Выберите пользователя и уровень прав
              </ThemedText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.brightText} />
            </TouchableOpacity>
          </View>

          <View style={styles.roleRow}>
            <TouchableOpacity
              style={[
                styles.roleChip,
                selectedRole === AccessRole.READ && styles.roleChipActive,
              ]}
              onPress={() => setSelectedRole(AccessRole.READ)}
            >
              <Feather
                name="eye"
                size={14}
                color={
                  selectedRole === AccessRole.READ
                    ? Colors.brightText
                    : Colors.secondary
                }
              />
              <ThemedText
                style={[
                  styles.roleChipText,
                  selectedRole === AccessRole.READ && styles.roleChipTextActive,
                ]}
              >
                Только чтение
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.roleChip,
                selectedRole === AccessRole.WRITE && styles.roleChipActive,
              ]}
              onPress={() => setSelectedRole(AccessRole.WRITE)}
            >
              <Feather
                name="edit-3"
                size={14}
                color={
                  selectedRole === AccessRole.WRITE
                    ? Colors.brightText
                    : Colors.secondary
                }
              />
              <ThemedText
                style={[
                  styles.roleChipText,
                  selectedRole === AccessRole.WRITE && styles.roleChipTextActive,
                ]}
              >
                Чтение и запись
              </ThemedText>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={styles.center}>
              <ActivityIndicator />
            </View>
          ) : (
            <FlatList
              data={friends || []}
              keyExtractor={(item) => item.friendshipId.toString()}
              renderItem={({ item }) => {
                const isSelected = selectedFriendId === item.friendProfile.id;
                return (
                  <TouchableOpacity
                    style={[
                      styles.friendItem,
                      isSelected && styles.friendItemSelected,
                    ]}
                    onPress={() => handleSelectFriend(item.friendProfile.id)}
                  >
                    <Image
                      source={{ uri: item.friendProfile.avatarUrl }}
                      style={styles.avatar}
                      contentFit="cover"
                    />
                    <View style={styles.friendMeta}>
                      <ThemedText style={styles.friendName}>
                        {item.friendProfile.firstName}
                      </ThemedText>
                    </View>
                    {isSelected && (
                      <Feather
                        name="check-circle"
                        size={24}
                        color={Colors.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <ThemedText style={styles.emptyText}>
                    У вас нет друзей
                  </ThemedText>
                </View>
              }
              contentContainerStyle={styles.listContent}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onClose}
              style={[styles.button, styles.cancelButton]}
            >
              <ThemedText style={styles.cancelButtonText}>Отмена</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              style={[
                styles.button,
                styles.confirmButton,
                !selectedFriendId && styles.buttonDisabled,
              ]}
              disabled={!selectedFriendId}
            >
              <ThemedText style={styles.confirmButtonText}>
                Предоставить
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 20,
    width: "90%",
    maxHeight: "80%",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    gap: 8,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.brightText,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.secondary,
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
  },
  roleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  roleChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  roleChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  roleChipText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: "600",
  },
  roleChipTextActive: {
    color: Colors.brightText,
  },
  center: {
    padding: 40,
    alignItems: "center",
  },
  listContent: {
    paddingBottom: 20,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: Colors.cardBackground,
    marginBottom: 8,
    gap: 12,
  },
  friendItemSelected: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  friendName: {
    fontSize: 16,
    color: Colors.brightText,
    fontWeight: "600",
  },
  friendMeta: {
    flex: 1,
    gap: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: Colors.secondary,
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  cancelButtonText: {
    color: Colors.brightText,
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButtonText: {
    color: Colors.brightText,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default GrantAccessModal;

