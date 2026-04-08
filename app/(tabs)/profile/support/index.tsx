import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import CreateSupportTicketModal from "@/shared/Modals/SupportModals/CreateSupportTicketModal";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import SupportTicketListRow from "@/widgets/support/components/SupportTicketListRow";
import { useProfileSupportScreen } from "@/widgets/support/hooks/useProfileSupportScreen";
import { Feather } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default function SupportListScreen() {
  const router = useRouter();
  const {
    accessToken,
    tickets,
    isLoading,
    formOpen,
    setFormOpen,
    isCreating,
    onSubmitForm,
  } = useProfileSupportScreen();

  if (!accessToken) {
    return (
      <View>
        <Header title="Поддержка" />
        <ThemedText style={styles.centerMsg}>Нет авторизации.</ThemedText>
      </View>
    );
  }

  return (
    <View>
      <Header
        title="Поддержка"
        rightAction={
          <TouchableOpacity
            onPress={() => setFormOpen(true)}
            hitSlop={12}
            accessibilityLabel="Новое обращение"
          >
            <Feather name="plus-circle" size={26} color={Colors.primary} />
          </TouchableOpacity>
        }
      />
      <FlatList
        data={tickets ?? []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SupportTicketListRow
            ticket={item}
            onPress={() =>
              router.push(`/(tabs)/profile/support/${item.id}` as Href)
            }
          />
        )}
        ListHeaderComponent={
          <RNView style={styles.listIntro}>
            <ThemedText style={styles.introTitle}>Мои обращения</ThemedText>
            <ThemedText style={styles.introHint}>
              Статусы обновляются автоматически. Откройте карточку для деталей.
            </ThemedText>
          </RNView>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={Colors.primary} style={styles.loader} />
          ) : (
            <ThemedText style={styles.empty}>Пока нет обращений — нажмите +</ThemedText>
          )
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <CreateSupportTicketModal
        visible={formOpen}
        mode="auth"
        isSubmitting={isCreating}
        onClose={() => setFormOpen(false)}
        onSubmit={onSubmitForm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingBottom: 32 },
  listIntro: { paddingVertical: 16, gap: 6 },
  introTitle: {
    color: Colors.brightText,
    fontSize: 17,
    fontWeight: "600",
  },
  introHint: { color: Colors.secondary, fontSize: 13, lineHeight: 18 },
  empty: { color: Colors.secondary, paddingVertical: 28, textAlign: "center" },
  loader: { marginVertical: 32 },
  centerMsg: { color: Colors.text, padding: 24, textAlign: "center" },
});
