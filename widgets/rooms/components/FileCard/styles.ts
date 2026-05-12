import type { AppColors } from "@/constants/colorPalettes";
import { StyleSheet } from "react-native";

export default function createFileCardStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: Colors.border,
    },
    containerSelected: {
      borderColor: Colors.primary,
      backgroundColor: Colors.inactive,
    },
    content: {
      gap: 8,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 8,
      backgroundColor: Colors.inactive,
      alignItems: "center",
      justifyContent: "center",
    },
    infoContainer: {
      flex: 1,
      gap: 2,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    fileName: {
      fontSize: 14,
      fontWeight: "600",
      color: Colors.brightText,
      flexShrink: 1,
    },
    tagsRow: {
      flexDirection: "row",
      marginTop: 2,
      marginBottom: 2,
    },
    tagBadge: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: `${Colors.secondary}20`,
      borderWidth: 1,
      borderColor: Colors.secondary,
      borderRadius: 6,
      paddingHorizontal: 6,
      paddingVertical: 2,
      marginRight: 4,
    },
    tagBadgeText: {
      fontSize: 10,
      color: Colors.secondary,
      fontWeight: "600",
    },
    fileMeta: {
      fontSize: 12,
      color: Colors.secondary,
    },
    progressContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    progressBar: {
      flex: 1,
      height: 4,
      backgroundColor: Colors.inactive,
      borderRadius: 2,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: Colors.primary,
    },
    progressText: {
      fontSize: 12,
      color: Colors.text,
      minWidth: 40,
      textAlign: "right",
    },
    previewContainer: {
      width: "100%",
      height: 200,
      borderRadius: 8,
      overflow: "hidden",
      backgroundColor: Colors.inactive,
      position: "relative",
    },
    previewImage: {
      width: "100%",
      height: "100%",
    },
    previewTapOverlay: {
      ...StyleSheet.absoluteFillObject,
    },
    expandHint: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 28,
      height: 28,
      borderRadius: 8,
      backgroundColor: "rgba(0, 0, 0, 0.45)",
      alignItems: "center",
      justifyContent: "center",
    },
    fullPreviewOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.95)",
      alignItems: "center",
      justifyContent: "center",
    },
    fullPreviewImage: {
      width: "100%",
      height: "100%",
    },
    closeButton: {
      position: "absolute",
      top: 50,
      right: 20,
      zIndex: 1001,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      alignItems: "center",
      justifyContent: "center",
    },
    favoriteIndicator: {
      backgroundColor: Colors.cardBackground,
    },
    selectedIndicator: {
      position: "absolute",
      top: 8,
      right: 8,
      backgroundColor: Colors.cardBackground,
      borderRadius: 12,
      padding: 4,
    },
  });
}
