import type { SupportTicket } from "@/api/types/support";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import SupportTicketStatusBadge from "@/widgets/support/components/SupportTicketStatusBadge";
import { supportStatusColor } from "@/widgets/support/data/supportStatus";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

export type SupportTicketDetailViewProps = {
  ticket: SupportTicket;
  isFetching?: boolean;
  detailsHeading?: string;
  resetLinkLabel?: string;
  onResetPress?: () => void;
};

const formatWhen = (iso: string) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

const SupportTicketDetailView: React.FC<SupportTicketDetailViewProps> = ({
  ticket,
  isFetching,
  detailsHeading = "Описание",
  resetLinkLabel,
  onResetPress,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  card: {
    backgroundColor: c.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.border,
    overflow: "hidden",
  },
  statusStripe: {
    height: 4,
    width: "100%",
    opacity: 0.95,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 4,
  },
  titleBlock: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: c.listBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  titleTextWrap: { flex: 1, gap: 4 },
  eyebrow: {
    fontSize: 11,
    fontWeight: "600",
    color: c.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  ticketTitle: {
    color: c.brightText,
    fontSize: 19,
    fontWeight: "700",
    lineHeight: 26,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  metaCard: {
    flex: 1,
    backgroundColor: c.listBackground,
    borderRadius: 14,
    padding: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: c.border,
  },
  metaLabel: {
    fontSize: 11,
    color: c.secondary,
    marginTop: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: "600",
    color: c.brightText,
  },
  section: {
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: c.brightText,
  },
  bodyBox: {
    backgroundColor: c.listBackground,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: c.border,
  },
  body: {
    color: c.text,
    fontSize: 15,
    lineHeight: 24,
  },
  replyBox: {
    backgroundColor: c.inactive,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: c.border,
    borderLeftWidth: 3,
  },
  replyBody: {
    color: c.brightText,
    fontSize: 15,
    lineHeight: 24,
  },
  replyFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  replyMeta: { fontSize: 12, color: c.secondary },
  pendingHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 18,
    marginVertical: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: c.listBackground,
    borderWidth: 1,
    borderColor: c.border,
  },
  pendingText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: c.secondary,
  },
  fetchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  fetchText: { fontSize: 13, color: c.secondary },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 18,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: c.primary,
    backgroundColor: c.primary + "12",
  },
  secondaryBtnText: {
    color: c.primary,
    fontSize: 14,
    fontWeight: "600",
  },

}));

  const statusTint = supportStatusColor(ticket.status);

  return (
    <View style={styles.card}>
      <View style={[styles.statusStripe, { backgroundColor: statusTint }]} />

      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <View style={[styles.iconCircle, { borderColor: statusTint + "55" }]}>
            <Feather name="layers" size={20} color={statusTint} />
          </View>
          <View style={styles.titleTextWrap}>
            <ThemedText style={styles.eyebrow}>Обращение в поддержку</ThemedText>
            <ThemedText style={styles.ticketTitle}>{ticket.title}</ThemedText>
          </View>
        </View>
        <SupportTicketStatusBadge status={ticket.status} />
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaCard}>
          <Feather name="calendar" size={16} color={themeColors.secondary} />
          <ThemedText style={styles.metaLabel}>Создано</ThemedText>
          <ThemedText style={styles.metaValue}>{formatWhen(ticket.createdAt)}</ThemedText>
        </View>
        <View style={styles.metaCard}>
          <Feather name="clock" size={16} color={themeColors.secondary} />
          <ThemedText style={styles.metaLabel}>Обновлено</ThemedText>
          <ThemedText style={styles.metaValue}>{formatWhen(ticket.updatedAt)}</ThemedText>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionTitleRow}>
          <Feather name="align-left" size={15} color={themeColors.primary} />
          <ThemedText style={styles.sectionTitle}>{detailsHeading}</ThemedText>
        </View>
        <View style={styles.bodyBox}>
          <ThemedText style={styles.body}>{ticket.details}</ThemedText>
        </View>
      </View>

      {ticket.adminResponse ? (
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Feather name="headphones" size={15} color={themeColors.gradientPrimary} />
            <ThemedText style={styles.sectionTitle}>Ответ поддержки</ThemedText>
          </View>
          <View
            style={[styles.replyBox, { borderLeftColor: themeColors.primary }]}
          >
            <ThemedText style={styles.replyBody}>{ticket.adminResponse}</ThemedText>
            {ticket.respondedAt ? (
              <View style={styles.replyFooter}>
                <Feather name="check-circle" size={12} color={themeColors.secondary} />
                <ThemedText style={styles.replyMeta}>
                  {formatWhen(ticket.respondedAt)}
                </ThemedText>
              </View>
            ) : null}
          </View>
        </View>
      ) : (
        <View style={styles.pendingHint}>
          <Feather name="coffee" size={16} color={themeColors.secondary} />
          <ThemedText style={styles.pendingText}>
            Ожидает ответа. Мы уведомим, когда поддержка отреагирует.
          </ThemedText>
        </View>
      )}

      {isFetching ? (
        <View style={styles.fetchRow}>
          <ActivityIndicator color={themeColors.primary} size="small" />
          <ThemedText style={styles.fetchText}>Обновление…</ThemedText>
        </View>
      ) : null}

      {resetLinkLabel && onResetPress ? (
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={onResetPress}
          activeOpacity={0.75}
        >
          <Feather name="rotate-ccw" size={16} color={themeColors.primary} />
          <ThemedText style={styles.secondaryBtnText}>{resetLinkLabel}</ThemedText>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default SupportTicketDetailView;
