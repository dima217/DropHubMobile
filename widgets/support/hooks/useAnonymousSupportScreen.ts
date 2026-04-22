import {
  useCreateAnonymousSupportTicketMutation,
  useGetAnonymousSupportTicketQuery,
} from "@/api/supportApi";
import { useSupportAnonymousTicketRealtime } from "@/hooks/data/useSupportRealtime";
import { secureStore } from "@/services/secureStore";
import type { CreateSupportTicketPayload } from "@/shared/Modals/SupportModals/CreateSupportTicketModal";
import { useI18n } from "@/shared/localization";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";

export function useAnonymousSupportScreen() {
  const { tl } = useI18n();
  const [stored, setStored] = useState<{ id: string; token: string } | null>(
    null
  );
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    secureStore.getAnonymousSupportCredentials().then(setStored);
  }, []);

  const canFetchTicket = !!(stored?.id && stored?.token);
  const {
    data: ticket,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetAnonymousSupportTicketQuery(
    { id: stored?.id ?? "", token: stored?.token ?? "" },
    { skip: !canFetchTicket }
  );

  const refetchTicket = useCallback(() => {
    void refetch();
  }, [refetch]);

  useSupportAnonymousTicketRealtime(
    stored?.id,
    stored?.token,
    canFetchTicket,
    refetchTicket
  );

  const [createTicket, { isLoading: isCreating }] =
    useCreateAnonymousSupportTicketMutation();

  const onSubmitForm = async (payload: CreateSupportTicketPayload) => {
    const email = payload.contactEmail?.trim();
    if (!email) {
      Alert.alert(tl("Форма"), tl("Укажите email."));
      return;
    }
    try {
      const res = await createTicket({
        title: payload.title,
        details: payload.details,
        contactEmail: email,
      }).unwrap();
      const creds = { id: res.id, token: res.anonymousAccessToken };
      await secureStore.setAnonymousSupportCredentials(creds);
      setStored(creds);
      setFormOpen(false);
    } catch {
      Alert.alert(tl("Ошибка"), tl("Не удалось создать обращение. Попробуйте позже."));
    }
  };

  const forgetTicket = async () => {
    await secureStore.setAnonymousSupportCredentials(null);
    setStored(null);
  };

  return {
    stored,
    canFetchTicket,
    ticket,
    isLoading,
    isFetching,
    isError,
    formOpen,
    setFormOpen,
    isCreating,
    onSubmitForm,
    forgetTicket,
  };
}
