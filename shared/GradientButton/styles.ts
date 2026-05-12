import type { AppColors } from "@/constants/colorPalettes";
import { StyleSheet } from "react-native";

export default function createGradientButtonStyles(Colors: AppColors) {
  return StyleSheet.create({
    touchableContainer: {
      width: "100%",
      height: 56,
      borderRadius: 30,
      overflow: "hidden",
    },
    gradientContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    outline: {
      borderWidth: 1,
      borderColor: Colors.secondary,
    },
    buttonText: {
      fontSize: 16,
      fontFamily: "Inter-SemiBold",
    },
  });
}
