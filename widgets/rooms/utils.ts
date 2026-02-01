import { Friend } from "@/api/types/friend";
import { RoomItem } from "@/api/types/room";

export const getManagedUsers = (
  friends: Friend[],
  participants: RoomItem["participantsDetails"],
  manageUsersMode: "add" | "remove"
) => {
  const adminId = participants.find((p) => p.role === "admin")?.userId;

  const participantIds = new Set(
    participants.map((p) => p.userId)
  );

  if (manageUsersMode === "add") {
    return friends
      .map((friend) => ({
        id: friend.friendProfile.id,
        firstName: friend.friendProfile.firstName,
        avatarUrl: friend.friendProfile.avatarUrl,
      }))
      .filter(
        (user) =>
          user.id !== adminId &&       
          !participantIds.has(user.id) 
      );
  }

  // remove
  return participants
    .map((participant) => ({
      id: participant.userId,
      firstName: participant.profile?.firstName || "",
      avatarUrl: participant.profile?.avatarUrl,
    }))
    .filter((user) => user.id !== adminId);
};
