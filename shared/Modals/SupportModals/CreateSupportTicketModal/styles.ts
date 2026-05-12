import type { AppColors } from "@/constants/colorPalettes";
import { StyleSheet } from "react-native";

export function createSupportTicketModalStyles(Colors: AppColors) {
  return StyleSheet.create({
    fill: { flex: 1 },
    modalRoot: { flex: 1, justifyContent: "flex-end" },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    sheetWrap: {
      width: "100%",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      overflow: "hidden",
    },
    sheet: {
      flex: 0,
      flexGrow: 0,
      width: "100%",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingTop: 12,
      paddingHorizontal: 18,
    },
    handleRow: { alignItems: "center", marginBottom: 8 },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: Colors.secondary,
    },
    title: {
      textAlign: "center",
      color: Colors.brightText,
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 6,
    },
    subtitle: {
      textAlign: "center",
      color: Colors.secondary,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    scroll: { marginBottom: 16 },
    scrollContent: { gap: 14, paddingBottom: 8 },
    footer: { flexDirection: "row", gap: 12 },
    footerBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    cancelBtn: {
      backgroundColor: Colors.inactive,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    cancelText: { color: Colors.secondary, fontWeight: "600" },
    submitBtn: { backgroundColor: Colors.primary },
    submitText: { color: Colors.brightText, fontWeight: "600" },
  });
}
