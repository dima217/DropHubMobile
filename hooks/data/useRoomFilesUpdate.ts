import { API_ORIGIN } from "@/constants/apiConfig";
import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

export const useRoomFilesUpdate = (
  roomId: string,
  accessToken: string,
  onRoomFilesUpdate: (roomId: string) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, emit, off } = useWebSocket(API_ORIGIN, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) {
      return;
    }

    const handleRoomUpdate = ({
      updatedRoomId,
      type,
    }: {
      updatedRoomId: string;
      type: string;
    }) => {
      if (updatedRoomId === roomId && type === "files") {
        onRoomFilesUpdate(roomId);
      }
    };

    emit("subscribeToRoomUpdates", roomId);
    on("room:update", handleRoomUpdate);

    return () => {
      emit("unsubscribeFromUpdates", roomId);
      off("room:update", handleRoomUpdate);
    };
  }, [off, emit, isConnected, on, onRoomFilesUpdate, isEnabled, roomId]);
};
