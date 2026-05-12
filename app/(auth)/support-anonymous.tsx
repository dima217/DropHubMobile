import { ThemedText } from "@/shared/core/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";
import Header from "@/shared/Header";
import { useI18n } from "@/shared/localization";
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
  TouchableOpacity,
} from "react-native";

export default function SupportAnonymousScreen() {
  const colors = useThemeColors();
  const { tl } = useI18n();
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

  const styles = useThemedStyles((c) => ({
    scroll: { flex: 1 },
    content: { paddingVertical: 16, paddingBottom: 32 },
    detailWrap: { marginTop: 4 },
    errorCard: {
      backgroundColor: c.cardBackground,
      borderRadius: 16,
      padding: 18,
      borderWidth: 1,
      borderColor: c.border,
      gap: 12,
    },
    hint: { color: c.text, fontSize: 14, lineHeight: 20 },
    link: { color: c.primary, fontSize: 14 },
    loader: { marginTop: 24 },
  }));

  const onForget = () => {
    Alert.alert(
      tl("Сбросить доступ?"),
      tl("Без сохранённого токена вы не сможете открыть это обращение с этого устройства."),
      [
        { text: tl("Отмена"), style: "cancel" },
        {
          text: tl("Сбросить"),
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
          <ActivityIndicator color={colors.primary} style={styles.loader} />
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
