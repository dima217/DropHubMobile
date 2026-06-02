import { FriendRequestResponse } from "@/api/types/friend";
import { API_ORIGIN } from "@/constants/apiConfig";
import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

export const useFriendRequestUpdate = (
  accessToken: string,
  onFriendRequestUpdate: (updatedFriendRequest: FriendRequestResponse) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, emit, off } = useWebSocket(API_ORIGIN, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) {
      return;
    }

    const handleUpdate = (updatedFriendRequest: FriendRequestResponse) => {
      onFriendRequestUpdate(updatedFriendRequest);
    };

    emit("subscribeToFriends");
    on("friendRequest", handleUpdate);

    return () => {
      emit("unsubscribeFromUpdates");
    };
  }, [off, emit, isConnected, on, onFriendRequestUpdate, isEnabled]);
};
