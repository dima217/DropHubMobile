import { useAddUsersToRoomMutation, useDeleteRoomMutation, useRemoveUsersFromRoomMutation, useUpdateRoomMutation } from "@/api/roomApi";
import { AccessRole, RoomItem } from "@/api/types/room";
import { useI18n } from "@/shared/localization";
import { ActionMenuItemData } from "@/shared/ui/ActionMenu/ActionMenuItem";
import { useState } from "react";

interface UseRoomActionMenuProps {
  room: RoomItem;
  onRefresh?: () => void;
  /** When user chooses "Archive", navigate to storage to pick destination folder */
  onNavigateToArchive?: (roomId: string) => void;
}

export const useRoomActionMenu = ({ room, onRefresh, onNavigateToArchive }: UseRoomActionMenuProps) => {
  const [deleteRoom, { isLoading: isDeleting }] = useDeleteRoomMutation();
  const [removeUsers, { isLoading: isRemovingUsers }] = useRemoveUsersFromRoomMutation();
  const [addUsers, { isLoading: isAddingUsers }] = useAddUsersToRoomMutation();
  const [updateRoom, { isLoading: isUpdatingRoom }] = useUpdateRoomMutation();

  const { tl } = useI18n();
  const [openManageUsersModal, setOpenManageUsersModal] = useState(false);
  const [manageUsersMode, setManageUsersMode] = useState<"add" | "remove">("add");
  const [openEditRoomModal, setOpenEditRoomModal] = useState(false);

  const handleDeleteRoom = async () => {
    try {
      await deleteRoom({ roomId: room.id }).unwrap();
      onRefresh?.();
    } catch (error) {
      console.error("Failed to delete room:", error);
    }
  };

  const handleAddUsers = () => {
    setOpenManageUsersModal(true);
    setManageUsersMode("add");
  };

  const handleConfirmManageUsers = async (roomId: string, selectedUserIds: number[]) => {
    if (manageUsersMode === "add") {
      await addUsers({ roomId, targetUserIds: selectedUserIds, role: AccessRole.WRITE }).unwrap();
    } else {
      await removeUsers({ roomId, targetUserIds: selectedUserIds }).unwrap();
    }
    onRefresh?.();
  };

  const handleRemoveUsers = async () => {
    setOpenManageUsersModal(true);
    setManageUsersMode("remove");
  };

  const handleEditRoom = () => {
    setOpenEditRoomModal(true);
  };

  const handleConfirmEditRoom = async (roomId: string, owner: string) => {
    await updateRoom({ roomId, owner }).unwrap();
    onRefresh?.();
  };

  const handleArchiveRoom = () => {
    onNavigateToArchive?.(room.id);
  };

  const items: ActionMenuItemData[] = [
    {
      id: "add-users",
      icon: "user-plus",
      label: tl("Add Users"),
      onPress: handleAddUsers,
      disabled: isDeleting || isRemovingUsers,
    },
    {
      id: "remove-users",
      icon: "user-minus",
      label: tl("Remove Users"),
      onPress: handleRemoveUsers,
      disabled: isDeleting || isRemovingUsers,
    },
    {
      id: "edit",
      icon: "edit",
      label: tl("Edit Room"),
      onPress: handleEditRoom,
      disabled: isDeleting || isRemovingUsers,
    },
    ...(room.archived
      ? []
      : [
          {
            id: "archive",
            icon: "archive" as const,
            label: tl("Архивировать"),
            onPress: handleArchiveRoom,
            disabled: isDeleting || isRemovingUsers,
          },
        ]),
    {
      id: "delete",
      icon: "trash-2" as const,
      label: tl("Delete Room"),
      onPress: handleDeleteRoom,
      destructive: true,
      disabled: isDeleting || isRemovingUsers,
    },
  ];

  return {
    items,
    isLoading: isDeleting || isRemovingUsers,
    openManageUsersModal,
    manageUsersMode,
    setOpenManageUsersModal,
    setManageUsersMode,
    handleConfirmManageUsers,
    openEditRoomModal,
    setOpenEditRoomModal,
    handleConfirmEditRoom,
  };
};

