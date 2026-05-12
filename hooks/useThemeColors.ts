import type { AppColors } from "@/constants/colorPalettes";
import { useAppTheme } from "@/providers/ThemeProvider";

export function useThemeColors(): AppColors {
  return useAppTheme().colors;
}
