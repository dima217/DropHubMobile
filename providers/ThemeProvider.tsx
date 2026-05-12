import { darkColors, lightColors, type AppColors } from "@/constants/colorPalettes";
import * as SystemUI from "expo-system-ui";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Appearance, useColorScheme } from "react-native";

export type ThemeContextValue = {
  colorScheme: "light" | "dark";
  colors: AppColors;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolveScheme(
  scheme: string | null | undefined
): "light" | "dark" {
  if (scheme === "light" || scheme === "dark") return scheme;
  const app = Appearance.getColorScheme();
  if (app === "light" || app === "dark") return app;
  return "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [appearanceScheme, setAppearanceScheme] = useState<
    "light" | "dark" | null
  >(() => Appearance.getColorScheme() ?? null);

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => {
      setAppearanceScheme(colorScheme ?? null);
    });
    return () => sub.remove();
  }, []);

  const colorScheme = useMemo(
    () => resolveScheme(systemScheme ?? appearanceScheme),
    [systemScheme, appearanceScheme]
  );

  const colors = colorScheme === "light" ? lightColors : darkColors;

  const value = useMemo(
    () => ({ colorScheme, colors }),
    [colorScheme, colors]
  );

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(colors.background);
  }, [colors.background]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { colorScheme: "dark", colors: darkColors };
  }
  return ctx;
}
