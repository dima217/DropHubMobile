import { WebSocketService } from "@/services/websocket/WebSocketService";
import { useCallback, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

export const useWebSocket = (url: string, token?: string) => {
  const serviceRef = useRef<WebSocketService | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const [isConnected, setIsConnected] = useState(false);
  const [socketId, setSocketId] = useState<string | undefined>();

  useEffect(() => {
    if (!token) return;

    serviceRef.current?.disconnect();

    const service = new WebSocketService();
    serviceRef.current = service;

    const socket = service.connect(url, token);
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      setSocketId(socket.id);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setSocketId(undefined);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      service.disconnect();
      socketRef.current = null;
    };
  }, [url, token]);

  const emit = useCallback(
    (event: string, data?: any) => {
      if (socketRef.current && isConnected) {
        socketRef.current.emit(event, data);
      }
    },
    [isConnected]
  );

  const on = useCallback(
    (event: string, callback: (...args: any[]) => void) => {
      socketRef.current?.on(event, callback);
    },
    []
  );

  const off = useCallback(
    (event: string, callback?: (...args: any[]) => void) => {
      socketRef.current?.off(event, callback);
    },
    []
  );

  const disconnect = useCallback(() => {
    serviceRef.current?.disconnect();
    socketRef.current = null;
    setIsConnected(false);
    setSocketId(undefined);
  }, []);

  return {
    isConnected,
    socketId,
    emit,
    on,
    off,
    disconnect,
    socket: socketRef.current,
  };
};
