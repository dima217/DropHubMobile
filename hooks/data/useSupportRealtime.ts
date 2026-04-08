import { API_ORIGIN } from "@/constants/apiOrigin";
import { useEffect, useRef } from "react";
import { useWebSocket } from "../websocket/useWebSocket";

type TicketUpdatedPayload = { ticketId?: string };

export function useSupportAuthRealtime(
  accessToken: string | null | undefined,
  enabled: boolean,
  onTicketUpdated: () => void
) {
  const onUpdatedRef = useRef(onTicketUpdated);
  onUpdatedRef.current = onTicketUpdated;

  const { isConnected, emit, on, off } = useWebSocket(
    API_ORIGIN,
    accessToken || "",
    { allowConnectWithoutToken: false }
  );

  useEffect(() => {
    if (!enabled || !accessToken || !isConnected) return;

    emit("support.subscribeUser");
    const handler = (payload: TicketUpdatedPayload) => {
      if (payload?.ticketId) onUpdatedRef.current();
    };
    on("support.ticket.updated", handler);

    return () => {
      emit("support.unsubscribeUser");
      off("support.ticket.updated", handler);
    };
  }, [enabled, accessToken, isConnected, emit, on, off]);
}

export function useSupportTicketRealtime(
  ticketId: string | undefined,
  accessToken: string | null | undefined,
  enabled: boolean,
  onTicketUpdated: () => void
) {
  const onUpdatedRef = useRef(onTicketUpdated);
  onUpdatedRef.current = onTicketUpdated;

  const { isConnected, emit, on, off } = useWebSocket(
    API_ORIGIN,
    accessToken || "",
    { allowConnectWithoutToken: false }
  );

  useEffect(() => {
    if (!enabled || !accessToken || !isConnected || !ticketId) return;

    emit("support.subscribeTicket", { ticketId });
    const handler = (payload: TicketUpdatedPayload) => {
      if (payload?.ticketId === ticketId) onUpdatedRef.current();
    };
    on("support.ticket.updated", handler);

    return () => {
      off("support.ticket.updated", handler);
    };
  }, [enabled, accessToken, isConnected, ticketId, emit, on, off]);
}

export function useSupportAnonymousTicketRealtime(
  ticketId: string | undefined,
  token: string | undefined,
  enabled: boolean,
  onTicketUpdated: () => void
) {
  const onUpdatedRef = useRef(onTicketUpdated);
  onUpdatedRef.current = onTicketUpdated;

  const { isConnected, emit, on, off } = useWebSocket(API_ORIGIN, "", {
    allowConnectWithoutToken: true,
  });

  useEffect(() => {
    if (!enabled || !isConnected || !ticketId || !token) return;

    emit("support.subscribeAnonymousTicket", { ticketId, token });
    const handler = (payload: TicketUpdatedPayload) => {
      if (payload?.ticketId === ticketId) onUpdatedRef.current();
    };
    on("support.ticket.updated", handler);

    return () => {
      off("support.ticket.updated", handler);
    };
  }, [enabled, isConnected, ticketId, token, emit, on, off]);
}

