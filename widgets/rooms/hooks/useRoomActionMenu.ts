import { useDeleteRoomMutation, useRemoveUsersFromRoomMutation } from "@/api/roomApi";
import { RoomItem } from "@/api/types/room";
import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";

interface UseRoomActionMenuProps {
  room: RoomItem;
  onRefresh?: () => void;
}

export const useRoomActionMenu = ({ room, onRefresh }: UseRoomActionMenuProps) => {
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
  const [removeUsers, { isLoading: isRemovingUsers }] = useRemoveUsersFromRoomMutation();

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom({ roomId: room.id }).unwrap();
      onRefresh?.();
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  const handleAddUsers = () => {
    console.log("Add users to room:", room.id);
  };

  const handleRemoveUsers = async () => {
    // TODO: Открыть модалку для выбора пользователей для удаления
    // Пока просто пример
    const participantIds = room.participantsDetails
      .filter((p) => p.role !== "admin")
      .map((p) => p.userId);

    if (participantIds.length > 0) {
      try {
        await removeUsers({
          roomId: room.id,
          targetUserIds: participantIds.slice(0, 1), // Пример: удаляем первого не-админа
        }).unwrap();
        onRefresh?.();
      } catch (error) {
        console.error("Failed to remove users:", error);
      }
    }
  };

  const handleEditRoom = () => {
    console.log("Edit room:", room.id);
  };

  const handleShareRoom = () => {
    console.log("Share room:", room.id);
  };

  const items: ActionMenuItemData[] = [
    {
      id: "add-users",
      icon: "user-plus",
      label: "Add Users",
      onPress: handleAddUsers,
      disabled: isDeleting || isRemovingUsers,
    },
    {
      id: "remove-users",
      icon: "user-minus",
      label: "Remove Users",
      onPress: handleRemoveUsers,
      disabled: isDeleting || isRemovingUsers,
    },
    {
      id: "edit",
      icon: "edit",
      label: "Edit Room",
      onPress: handleEditRoom,
      disabled: isDeleting || isRemovingUsers,
    },
    {
      id: "share",
      icon: "share-2",
      label: "Share Room",
      onPress: handleShareRoom,
      disabled: isDeleting || isRemovingUsers,
    },
    {
      id: "delete",
      icon: "trash-2",
      label: "Delete Room",
      onPress: handleDeleteRoom,
      destructive: true,
      disabled: isDeleting || isRemovingUsers,
    },
  ];

  return {
    items,
    isLoading: isDeleting || isRemovingUsers,
  };
};

