import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import BaseModal from "@/shared/Modals/BaseModal";
import FriendCard from "@/shared/Modals/RoomModals/ui/FriendCard";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

export type UserItem = {
  id: number;
  firstName: string;
  avatarUrl?: string | null;
};

interface ManageUsersModalProps {
  isVisible: boolean;
  onClose: () => void;
  mode: "add" | "remove"; 
  users: UserItem[];
  roomId: string;
  isLoading?: boolean;
  onConfirm: (roomId: string, selectedUserIds: number[]) => void;
}

const ManageUsersModal: React.FC<ManageUsersModalProps> = ({
  isVisible,
  onClose,
  mode,
  users,
  roomId,
  isLoading = false,
  onConfirm,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  content: {
    width: "100%",
    marginBottom: 10,
  },
  usersList: {
    maxHeight: 300,
  },
  emptyText: {
    fontSize: 12,
    color: c.secondary,
    textAlign: "center",
    paddingVertical: 20,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },

}));

  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set());

  const toggleUser = (userId: number) => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleConfirm = () => {
    onConfirm(roomId, Array.from(selectedUserIds));
    setSelectedUserIds(new Set());
    onClose();
  };

  const handleClose = () => {
    if (isLoading) return;
    setSelectedUserIds(new Set());
    onClose();
  };

  const title = mode === "add" ? "Add Users" : "Remove Users";

  return (
    <BaseModal
      isVisible={isVisible}
      title={title}
      onClose={handleClose}
      width="90%"
      height="45%"
      buttons={[
        {
          title: mode === "add" ? "Add" : "Remove",
          onPress: handleConfirm,
          variant: "primary",
          loading: isLoading,
          disabled: isLoading,
        },
        {
          title: "Cancel",
          onPress: handleClose,
          variant: "secondary",
          disabled: isLoading,
        },
      ]}
    >
      <View style={styles.content}>
        {users.length === 0 ? (
          <ThemedText style={styles.emptyText}>No users available</ThemedText>
        ) : (
          <ScrollView
            style={styles.usersList}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {users.map((user) => {
              const isSelected = selectedUserIds.has(user.id);

              return (
                <FriendCard
                  key={user.id}
                  id={user.id}
                  firstName={user.firstName}
                  avatarUrl={user.avatarUrl}
                  isSelected={isSelected}
                  onToggle={toggleUser}
                  disabled={isLoading}
                  selectionColor={mode === "add" ? themeColors.primary : themeColors.reject}
                />
              );
            })}
          </ScrollView>
        )}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={themeColors.primary} />
          </View>
        )}
      </View>
    </BaseModal>
  );
};

export default ManageUsersModal;
