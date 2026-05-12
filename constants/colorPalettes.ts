/**
 * Shared app colors. Primary blue stays the same in light and dark themes.
 */
export type AppColors = {
  primary: string;
  gradientPrimary: string;
  text: string;
  brightText: string;
  secondary: string;
  inactive: string;
  background: string;
  tab: string;
  border: string;
  cardBackground: string;
  listBackground: string;
  grey: string;
  gradient: readonly [string, string];
  buttonGradient: readonly [string, string];
  reject: string;
};

/** Current dark UI (existing palette). */
export const darkColors: AppColors = {
  primary: "#2788E6",
  gradientPrimary: "#8BB8FF",
  text: "#FFFFFFB3",
  brightText: "#FFFF",
  secondary: "#8B868F",
  inactive: "#1A1A1A",
  background: "#060D18",
  tab: "#232323",
  border: "#232540",
  cardBackground: "#171A29",
  listBackground: "#21253A",
  grey: "#404349",
  gradient: ["#1A1A1A", "#242424"] as const,
  buttonGradient: ["#2788E6", "#8BB8FF"] as const,
  reject: "#ff4a75",
};

/** Light UI: same primary blue, light surfaces and dark text. */
export const lightColors: AppColors = {
  primary: "#2788E6",
  gradientPrimary: "#8BB8FF",
  text: "#334155CC",
  brightText: "#0F172A",
  secondary: "#64748B",
  inactive: "#E2E8F0",
  background: "#F0F5FC",
  tab: "#FFFFFF",
  border: "#CBD5E1",
  cardBackground: "#FFFFFF",
  listBackground: "#E8EEF7",
  grey: "#94A3B8",
  gradient: ["#E2E8F0", "#F1F5F9"] as const,
  buttonGradient: ["#2788E6", "#8BB8FF"] as const,
  reject: "#ff4a75",
};
