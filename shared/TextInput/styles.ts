import type { AppColors } from "@/constants/colorPalettes";
import { StyleSheet } from "react-native";

export default function createTextInputStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      flexDirection: "column",
      width: "100%",
    },
    inputContainer: {
      width: "100%",
      borderRadius: 29,
      height: 58,
      paddingHorizontal: 15,
      backgroundColor: Colors.listBackground,
      borderColor: Colors.border,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    inputContainerMultiline: {
      height: undefined,
      minHeight: 100,
      alignItems: "flex-start",
      paddingVertical: 12,
    },
    input: {
      width: "90%",
      color: Colors.brightText,
      fontSize: 16,
    },
    inputMultiline: {
      minHeight: 88,
      textAlignVertical: "top",
      paddingTop: 4,
      width: "100%",
      flex: 1,
    },
    label: {
      fontSize: 12,
      color: Colors.secondary,
      opacity: 100,
      paddingLeft: 15,
    },
    disabledInputContainer: {
      backgroundColor: Colors.inactive,
      borderBottomColor: Colors.inactive,
    },
    errorText: {
      color: "#FF3B30",
      fontSize: 12,
      marginTop: 4,
      marginLeft: 15,
    },
    mainTextContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 10,
    },
    textContainer: {
      display: "flex",
      flexDirection: "column",
    },
    labelContainer: {
      paddingHorizontal: 8,
      paddingBottom: 6,
    },
    leftContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    rightContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    errorInputContainer: {
      borderBottomColor: Colors.reject,
    },
    errorContainer: {
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    error: {
      fontSize: 10,
      color: Colors.reject,
    },
  });
}
