// useMatchUpdates.ts
import { Match } from "@/api/types/match";
import { useEffect } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

const WS_URL = "http://84.201.188.209:3000";

export const useMatchUpdates = (
  accessToken: string,
  onMatchUpdate: (updatedMatch: Match) => void,
  isEnabled: boolean
) => {
  const { isConnected, on, emit, off } = useWebSocket(WS_URL, accessToken);

  useEffect(() => {
    if (!isConnected || !isEnabled) {
      return;
    }

    const handleUpdate = (updatedMatch: Match) => {
      onMatchUpdate(updatedMatch);
    };

    emit("subscribeToUpdates");
    on("matchUpdate", handleUpdate);

    return () => {
      emit("unsubscribeFromUpdates");
    };
  }, [off, emit, isConnected, on, onMatchUpdate, isEnabled]);
};
