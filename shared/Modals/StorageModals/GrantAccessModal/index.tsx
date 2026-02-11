import { useGetFriendsQuery } from "@/api/friendApi";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import ActivityIndicator from "@/shared/ui/ActivityIndicator";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";

interface GrantAccessModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectFriend: (friendId: number) => void;
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

  const handleSelectFriend = (friendId: number) => {
    setSelectedFriendId(friendId);
  };

  const handleConfirm = () => {
    if (selectedFriendId) {
      onSelectFriend(selectedFriendId);
      setSelectedFriendId(null);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Выберите друга</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.brightText} />
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
                    <ThemedText style={styles.friendName}>
                      {item.friendProfile.firstName}
                    </ThemedText>
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
                Предоставить доступ
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
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.brightText,
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
    flex: 1,
    fontSize: 16,
    color: Colors.brightText,
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
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
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

