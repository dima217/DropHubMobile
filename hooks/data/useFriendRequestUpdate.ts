import { FriendRequestResponse } from "@/api/types/friend";
import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://10.132.93.195:3000";

export const useFriendRequestUpdate = (
  accessToken: string,
  onFriendRequestUpdate: (updatedFriendRequest: FriendRequestResponse) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, emit, off } = useWebSocket(WS_URL, accessToken);

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
