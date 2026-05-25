import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://10.158.36.195:3000";

export const useRoomFilesUpdate = (
  roomId: string,
  accessToken: string,
  onRoomFilesUpdate: (roomId: string) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, emit, off } = useWebSocket(WS_URL, accessToken);

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
