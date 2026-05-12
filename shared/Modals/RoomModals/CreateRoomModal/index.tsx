import { useGetFriendsQuery } from "@/api/friendApi";
import { useAddUsersToRoomMutation, useCreateRoomMutation } from "@/api/roomApi";
import { AccessRole } from "@/api/types/room";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import BaseModal from "@/shared/Modals/BaseModal";
import TextInput from "@/shared/TextInput";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import FriendCard from "../ui/FriendCard";

interface CreateRoomModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSuccess?: (roomId: string) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isVisible,
  onClose,
  onSuccess,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  content: {
    width: "100%",
    marginBottom: 10,
  },
  friendsSection: {
    marginTop: 16,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: c.text,
    marginBottom: 12,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 12,
    color: c.secondary,
    textAlign: "center",
    paddingVertical: 20,
  },
  friendsList: {
    maxHeight: 200,
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: c.inactive,
    marginBottom: 8,
    gap: 12,
  },
  friendItemSelected: {
    backgroundColor: c.cardBackground,
    borderWidth: 1,
    borderColor: c.primary,
  },
  friendText: {
    flex: 1,
    fontSize: 14,
    color: c.text,
  },
  friendTextSelected: {
    color: c.brightText,
    fontWeight: "600",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: c.secondary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  checkboxSelected: {
    backgroundColor: c.primary,
    borderColor: c.primary,
  },
  checkmark: {
    color: c.brightText,
    fontSize: 12,
    fontWeight: "bold",
  },

}));

  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [createRoom, { isLoading: isCreatingRoom }] = useCreateRoomMutation();
  const { data: friendsData, isLoading: friendsLoading } = useGetFriendsQuery();
  const [addUsersToRoom, { isLoading: isAddingUsers }] = useAddUsersToRoomMutation();

  const friends = friendsData || [];
  const isLoading = isCreatingRoom || isAddingUsers;

  const [selectedFriendIds, setSelectedFriendIds] = useState<Set<number>>(new Set());

  const toggleFriend = (friendId: number) => {
    setSelectedFriendIds((prev) => {
      const next = new Set(prev);
      if (next.has(friendId)) {
        next.delete(friendId);
      } else {
        next.add(friendId);
      }
      return next;
    });
  };


  const handleCreate = async () => {
    if (!username.trim()) {
      setError("Room name is required");
      return;
    }

    setError("");
    try {
      const createResult = await createRoom({ username: username.trim() }).unwrap();
      
      if (!createResult.success || !createResult.roomId) {
        setError("Failed to create room");
        return;
      }

      if (selectedFriendIds.size > 0) {
        try {
          const userIds = Array.from(selectedFriendIds);
          await addUsersToRoom({
            roomId: createResult.roomId,
            targetUserIds: userIds,
            role: AccessRole.WRITE,
          }).unwrap();
        } catch (addError: any) {
          console.warn("Failed to add users to room:", addError);
        }
      }

      setUsername("");
      setSelectedFriendIds(new Set());
      onClose();
      if (onSuccess) {
        onSuccess(createResult.roomId);
      }
    } catch (err: any) {
      const errorMessage = err?.data?.message || err?.message || "Failed to create room";
      setError(errorMessage);
    }
  };

  const handleClose = () => {
    if (isLoading) return; 
    setUsername("");
    setError("");
    setSelectedFriendIds(new Set());
    onClose();
  };

  return (
    <BaseModal
      isVisible={isVisible}
      title="Create New Room"
      onClose={handleClose}
      width="90%"
      height={500}
      buttons={[
        {
          title: "Create",
          onPress: handleCreate,
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
        <TextInput
          label="Room Name"
          placeholder="Enter room name"
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setError("");
          }}
          errorMessage={error}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />
        <View style={styles.friendsSection}>
          <ThemedText style={styles.sectionTitle}>
            Add Friends (Optional)
          </ThemedText>
          {friendsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={themeColors.primary} />
            </View>
          ) : friends.length === 0 ? (
            <ThemedText style={styles.emptyText}>
              No friends available
            </ThemedText>
          ) : (
            <ScrollView 
              style={styles.friendsList}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {friends.map((friend) => {
                const friendId = friend.friendProfile.id;
                const isSelected = selectedFriendIds.has(friendId);

                return (
                  <FriendCard
                    key={friendId}
                    id={friendId}
                    selectionColor={themeColors.primary}
                    firstName={friend.friendProfile.firstName}
                    avatarUrl={friend.friendProfile.avatarUrl}
                    isSelected={isSelected}
                    disabled={isLoading}
                    onToggle={toggleFriend}
                  />
                );
              })}
            </ScrollView>
            )}
          </View>
        </View>
      </BaseModal>
    );
  };

export default CreateRoomModal;
