import {
  useCreateSupportTicketMutation,
  useGetMySupportTicketsQuery,
} from "@/api/supportApi";
import { useSupportAuthRealtime } from "@/hooks/data/useSupportRealtime";
import { secureStore } from "@/services/secureStore";
import type { CreateSupportTicketPayload } from "@/shared/Modals/SupportModals/CreateSupportTicketModal";
import { useI18n } from "@/shared/localization";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useProfileSupportScreen() {
  const { tl } = useI18n();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    secureStore.getAccessToken().then(setAccessToken);
  }, []);

  const { data: tickets, isLoading, refetch } = useGetMySupportTicketsQuery(
    undefined,
    { skip: !accessToken }
  );

  const refetchList = useCallback(() => {
    void refetch();
  }, [refetch]);

  useSupportAuthRealtime(accessToken, !!accessToken, refetchList);

  const [createTicket, { isLoading: isCreating }] =
    useCreateSupportTicketMutation();

  const onSubmitForm = async (payload: CreateSupportTicketPayload) => {
    try {
      await createTicket({
        title: payload.title,
        details: payload.details,
        anonymous: false,
      }).unwrap();
      setFormOpen(false);
    } catch {
      Alert.alert(tl("Ошибка"), tl("Не удалось создать обращение."));
    }
  };

  return {
    accessToken,
    tickets,
    isLoading,
    formOpen,
    setFormOpen,
    isCreating,
    onSubmitForm,
  };
}
