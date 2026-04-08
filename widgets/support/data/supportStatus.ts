import type { SupportTicketStatus } from "@/api/types/support";
import { Colors } from "@/constants/design-tokens";

export const supportStatusColor = (s: SupportTicketStatus): string => {
  if (s === "open") return "#E6A927";
  if (s === "in_progress") return Colors.primary;
  return "#3DDC84";
};

export const supportStatusLabel: Record<SupportTicketStatus, string> = {
  open: "Открыто",
  in_progress: "В работе",
  resolved: "Решено",
};
