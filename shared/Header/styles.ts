import { AppColors } from "@/constants/colorPalettes";
import { StyleSheet } from "react-native";

export default function createHeaderStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: "transparent",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      color: Colors.text,
      textAlign: "center",
    },
  });
}
