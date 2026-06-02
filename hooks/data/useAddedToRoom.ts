import { RoomDetails } from "@/api/types/room";
import { API_ORIGIN } from "@/constants/apiConfig";
import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

export const useAddedToRoom = (
  accessToken: string,
  onAdded: (room: RoomDetails) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, off, emit } = useWebSocket(API_ORIGIN, accessToken);

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
