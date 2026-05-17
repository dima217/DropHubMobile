import { ThemedText } from "@/shared/core/ThemedText";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";
import Header from "@/shared/Header";
import { useI18n } from "@/shared/localization";
import View from "@/shared/View";
import { useSupportTicketDetailScreen } from "@/widgets/support/hooks/useSupportTicketDetailScreen";
import SupportTicketDetailView from "@/widgets/support/components/SupportTicketDetailView";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView } from "react-native";

export default function SupportTicketDetailScreen() {
  const colors = useThemeColors();
  const { tl } = useI18n();
  const router = useRouter();
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const rawId = typeof ticketId === "string" ? ticketId : ticketId?.[0];
  const { ticket, isLoading, isFetching, enabled } =
    useSupportTicketDetailScreen(rawId);

  const styles = useThemedStyles((c) => ({
    scroll: { paddingVertical: 16, paddingBottom: 32 },
    loader: { marginTop: 24 },
    centerMsg: { color: c.text, padding: 24, textAlign: "center" },
  }));

  return (
    <View>
      <Header title="Обращение" onBackPress={() => router.back()} />
      {!enabled ? (
        <ThemedText style={styles.centerMsg}>{tl("Нет данных.")}</ThemedText>
      ) : isLoading && !ticket ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : ticket ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <SupportTicketDetailView ticket={ticket} isFetching={isFetching} />
        </ScrollView>
      ) : (
        <ThemedText style={styles.centerMsg}>{tl("Обращение не найдено.")}</ThemedText>
      )}
    </View>
  );
}
