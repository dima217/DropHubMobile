import type { AppColors } from "@/constants/colorPalettes";
import { StyleSheet } from "react-native";

export function createAvatarStyles(Colors: AppColors) {
  return StyleSheet.create({
    avatarBackground: {
      backgroundColor: Colors.inactive,
    },
    avatarText: {
      color: Colors.primary,
    },
  });
}
