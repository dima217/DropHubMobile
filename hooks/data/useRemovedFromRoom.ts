import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://10.158.36.195:3000";

export const useRemovedFromRoom = (
  accessToken: string,
  onRemoved: (roomId: string) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, off, emit } = useWebSocket(WS_URL, accessToken);

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
