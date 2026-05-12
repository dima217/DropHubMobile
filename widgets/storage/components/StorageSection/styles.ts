import type { AppColors } from "@/constants/colorPalettes";
import { StyleSheet } from "react-native";

export function createStorageSectionStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
      alignItems: "center",
      marginTop: 16,
      marginBottom: 10,
    },
    breadcrumbContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 8,
    },
    batchDestinationBanner: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: Colors.cardBackground,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: Colors.border,
      gap: 10,
    },
    batchDestinationText: {
      color: Colors.secondary,
      fontSize: 13,
      lineHeight: 18,
    },
    batchDestinationWarning: {
      color: Colors.reject,
      fontSize: 12,
      lineHeight: 17,
    },
    batchDestinationActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    batchDestinationCancel: {
      color: Colors.secondary,
      fontSize: 16,
    },
    batchDestinationConfirm: {
      color: Colors.primary,
      fontSize: 16,
      fontWeight: "600",
    },
    batchDestinationConfirmDisabled: {
      opacity: 0.45,
    },
    tagsModalOverlay: {
      flex: 1,
      backgroundColor: "#000a",
      justifyContent: "center",
      padding: 24,
    },
    tagsModalBox: {
      backgroundColor: Colors.cardBackground,
      borderRadius: 16,
      padding: 20,
      gap: 12,
    },
    tagsModalTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: Colors.brightText,
    },
    tagsModalHint: {
      fontSize: 13,
      color: Colors.secondary,
    },
    tagsModalInput: {
      borderWidth: 1,
      borderColor: Colors.border,
      borderRadius: 12,
      padding: 12,
      color: Colors.brightText,
      minHeight: 80,
      textAlignVertical: "top",
    },
    tagsModalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
  });
}
