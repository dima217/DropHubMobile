import Header from "@/shared/Header";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useI18n } from "@/shared/localization";
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
  TouchableOpacity,
} from "react-native";

export default function SupportListScreen() {
  const colors = useThemeColors();
  const { tl } = useI18n();
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

  const styles = useThemedStyles((c) => ({
    listContent: { paddingBottom: 32, paddingVertical: 12 },
    listIntro: { paddingVertical: 16, gap: 6 },
    introTitle: {
      color: c.brightText,
      fontSize: 17,
      fontWeight: "600",
    },
    introHint: { color: c.secondary, fontSize: 13, lineHeight: 18 },
    empty: { color: c.secondary, paddingVertical: 28, textAlign: "center" },
    loader: { marginVertical: 32 },
    centerMsg: { color: c.text, padding: 24, textAlign: "center" },
  }));

  if (!accessToken) {
    return (
      <View>
        <Header title="Поддержка" />
        <ThemedText style={styles.centerMsg}>{tl("Нет авторизации.")}</ThemedText>
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
            accessibilityLabel={tl("Новое обращение")}
          >
            <Feather name="plus-circle" size={26} color={colors.primary} />
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
            <ThemedText style={styles.introTitle}>{tl("Мои обращения")}</ThemedText>
            <ThemedText style={styles.introHint}>
              {tl("Статусы обновляются автоматически. Откройте карточку для деталей.")}
            </ThemedText>
          </RNView>
        }
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={colors.primary} style={styles.loader} />
          ) : (
            <ThemedText style={styles.empty}>{tl("Пока нет обращений — нажмите +")}</ThemedText>
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
