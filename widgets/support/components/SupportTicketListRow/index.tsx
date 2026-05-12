import type { SupportTicket } from "@/api/types/support";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/core/ThemedText";
import SupportTicketStatusBadge from "@/widgets/support/components/SupportTicketStatusBadge";
import React from "react";
import { TouchableOpacity, View } from "react-native";

type Props = {
  ticket: SupportTicket;
  onPress: () => void;
};

const SupportTicketListRow: React.FC<Props> = ({ ticket, onPress }) => {
  const styles = useThemedStyles((c) => ({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 14,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    rowText: { flex: 1 },
    rowTitle: { color: c.brightText, fontSize: 15, fontWeight: "500" },
    rowMeta: { color: c.secondary, fontSize: 12, marginTop: 4 },
  }));

  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowText}>
        <ThemedText style={styles.rowTitle} numberOfLines={2}>
          {ticket.title}
        </ThemedText>
        <ThemedText style={styles.rowMeta} numberOfLines={1}>
          {new Date(ticket.updatedAt).toLocaleString()}
        </ThemedText>
      </View>
      <SupportTicketStatusBadge status={ticket.status} compact />
    </TouchableOpacity>
  );
};

export default SupportTicketListRow;
