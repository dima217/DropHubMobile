import type { AppColors } from "@/constants/colorPalettes";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useMemo } from "react";
import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native";

type NamedStyles<T> = {
  [P in keyof T]: ViewStyle | TextStyle | ImageStyle;
};

export function useThemedStyles<T extends NamedStyles<T>>(
  factory: (colors: AppColors) => T
): T {
  const colors = useThemeColors();
  return useMemo(() => StyleSheet.create(factory(colors)), [colors, factory]);
}
