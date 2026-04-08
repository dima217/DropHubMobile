import { useGetMySupportTicketQuery } from "@/api/supportApi";
import { useSupportTicketRealtime } from "@/hooks/data/useSupportRealtime";
import { secureStore } from "@/services/secureStore";
import { useCallback, useEffect, useState } from "react";

export function useSupportTicketDetailScreen(ticketId: string | undefined) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    secureStore.getAccessToken().then(setAccessToken);
  }, []);

  const id = ticketId ?? "";
  const enabled = !!(id && accessToken);

  const { data: ticket, isLoading, isFetching, refetch } =
    useGetMySupportTicketQuery(id, { skip: !enabled });

  const refetchTicket = useCallback(() => {
    void refetch();
  }, [refetch]);

  useSupportTicketRealtime(id, accessToken, enabled, refetchTicket);

  return { ticket, isLoading, isFetching, enabled };
}
