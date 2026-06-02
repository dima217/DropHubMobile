import { API_ORIGIN } from "@/constants/apiConfig";
import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

export const useRemovedFromRoom = (
  accessToken: string,
  onRemoved: (roomId: string) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, off, emit } = useWebSocket(API_ORIGIN, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) return;

    emit("subscribeToRemovalFromRoom");

    const handler = (data: { roomId: string }) => {
      onRemoved(data.roomId);
    };

    on("removedFromRoom", handler);

    return () => {
      off("removedFromRoom", handler);
    };
  }, [isConnected, isEnabled, emit, on, off, onRemoved]);
};
