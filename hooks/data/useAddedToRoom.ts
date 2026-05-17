import { RoomDetails } from "@/api/types/room";
import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://10.132.93.195:3000";

export const useAddedToRoom = (
  accessToken: string,
  onAdded: (room: RoomDetails) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, off, emit } = useWebSocket(WS_URL, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) return;

    emit("subscribeToAdditionToRoom");

    const handler = (room: RoomDetails) => {
      onAdded(room);
    };

    on("addedToRoom", handler);

    return () => {
      off("addedToRoom", handler);
    };
  }, [isConnected, isEnabled, emit, on, off, onAdded]);
};
