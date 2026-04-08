import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { useSupportTicketDetailScreen } from "@/widgets/support/hooks/useSupportTicketDetailScreen";
import SupportTicketDetailView from "@/widgets/support/components/SupportTicketDetailView";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";

export default function SupportTicketDetailScreen() {
  const router = useRouter();
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const rawId = typeof ticketId === "string" ? ticketId : ticketId?.[0];
  const { ticket, isLoading, isFetching, enabled } =
    useSupportTicketDetailScreen(rawId);

  return (
    <View>
      <Header title="Обращение" onBackPress={() => router.back()} />
      {!enabled ? (
        <ThemedText style={styles.centerMsg}>Нет данных.</ThemedText>
      ) : isLoading && !ticket ? (
        <ActivityIndicator color={Colors.primary} style={styles.loader} />
      ) : ticket ? (
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <SupportTicketDetailView ticket={ticket} isFetching={isFetching} />
        </ScrollView>
      ) : (
        <ThemedText style={styles.centerMsg}>Обращение не найдено.</ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingVertical: 16, paddingBottom: 32 },
  loader: { marginTop: 24 },
  centerMsg: { color: Colors.text, padding: 24, textAlign: "center" },
});
