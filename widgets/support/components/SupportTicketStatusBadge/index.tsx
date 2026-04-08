import type { SupportTicketStatus } from "@/api/types/support";
import { supportStatusColor, supportStatusLabel } from "@/widgets/support/data/supportStatus";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = { status: SupportTicketStatus; compact?: boolean };

const SupportTicketStatusBadge: React.FC<Props> = ({ status, compact }) => {
  const color = supportStatusColor(status);
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: color + "33" },
        compact && styles.badgeCompact,
      ]}
    >
      <ThemedText style={[styles.badgeText, { color }, compact && styles.badgeTextCompact]}>
        {supportStatusLabel[status]}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  badgeCompact: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: "600" },
  badgeTextCompact: { fontSize: 11 },
});

export default SupportTicketStatusBadge;
