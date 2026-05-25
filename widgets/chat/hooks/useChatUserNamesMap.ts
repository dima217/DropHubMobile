import { useGetFriendsQuery } from "@/api/friendApi";
import type { RoomDetails } from "@/api/types/room";
import type { User } from "@/store/slices/authSlice";
import { useMemo } from "react";

function addName(
  map: Map<string, string>,
  id: string | number | undefined,
  name: string | undefined
) {
  const trimmed = name?.trim();
  if (id == null || id === "" || !trimmed) return;
  map.set(String(id), trimmed);
}

export function useChatUserNamesMap(
  roomDetails: RoomDetails | undefined,
  currentUser: User | null | undefined
) {
  const { data: friends = [] } = useGetFriendsQuery();

  return useMemo(() => {
    const map = new Map<string, string>();

    addName(
      map,
      currentUser?.id,
      currentUser?.firstName ?? currentUser?.email?.split("@")[0]
    );

    roomDetails?.participantsDetails?.forEach((participant) => {
      addName(
        map,
        participant.userId,
        participant.profile?.firstName?.trim() || participant.email?.split("@")[0]
      );
    });

    friends.forEach((friend) => {
      addName(map, friend.friendProfile.id, friend.friendProfile.firstName);
    });

    return map;
  }, [roomDetails?.participantsDetails, currentUser, friends]);
}
