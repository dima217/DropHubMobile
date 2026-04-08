import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import Header from "@/shared/Header";
import CreateSupportTicketModal from "@/shared/Modals/SupportModals/CreateSupportTicketModal";
import View from "@/shared/View";
import SupportAnonymousEmptyCTA from "@/widgets/support/components/SupportAnonymousEmptyCTA";
import SupportTicketDetailView from "@/widgets/support/components/SupportTicketDetailView";
import { useAnonymousSupportScreen } from "@/widgets/support/hooks/useAnonymousSupportScreen";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  View as RNView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function SupportAnonymousScreen() {
  const router = useRouter();
  const {
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
  } = useAnonymousSupportScreen();

  const onForget = () => {
    Alert.alert(
      "Сбросить доступ?",
      "Без сохранённого токена вы не сможете открыть это обращение с этого устройства.",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Сбросить",
          style: "destructive",
          onPress: () => {
            void forgetTicket();
          },
        },
      ]
    );
  };

  const showTicket = !!ticket && canFetchTicket && !isError;

  return (
    <View>
      <Header title="Поддержка" onBackPress={() => router.back()} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {!stored ? (
          <SupportAnonymousEmptyCTA onOpenForm={() => setFormOpen(true)} />
        ) : canFetchTicket && isLoading && !ticket ? (
          <ActivityIndicator color={Colors.primary} style={styles.loader} />
        ) : showTicket ? (
          <RNView style={styles.detailWrap}>
            <SupportTicketDetailView
              ticket={ticket}
              isFetching={isFetching}
              detailsHeading="Ваше сообщение"
              resetLinkLabel="Новое обращение (сбросить доступ)"
              onResetPress={onForget}
            />
          </RNView>
        ) : canFetchTicket && (isError || !ticket) ? (
          <RNView style={styles.errorCard}>
            <ThemedText style={styles.hint}>
              Обращение не найдено или доступ недействителен.
            </ThemedText>
            <TouchableOpacity onPress={onForget}>
              <ThemedText style={styles.link}>Создать новое</ThemedText>
            </TouchableOpacity>
          </RNView>
        ) : null}
      </ScrollView>
      <CreateSupportTicketModal
        visible={formOpen}
        mode="anonymous"
        isSubmitting={isCreating}
        onClose={() => setFormOpen(false)}
        onSubmit={onSubmitForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingVertical: 16, paddingBottom: 32 },
  detailWrap: { marginTop: 4 },
  errorCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 12,
  },
  hint: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  link: { color: Colors.primary, fontSize: 14 },
  loader: { marginTop: 24 },
});
