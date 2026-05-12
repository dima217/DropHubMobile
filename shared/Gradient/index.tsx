import { useAppTheme } from "@/providers/ThemeProvider";
import { LinearGradient, LinearGradientProps } from "expo-linear-gradient";
import { StyleSheet, ViewProps, ViewStyle } from "react-native";

type GradientViewProps = ViewProps & {
  colors?: LinearGradientProps["colors"];
  locations?: LinearGradientProps["locations"];
  style?: ViewStyle;
};

const darkGradientColors = [
  "#10121A",
  "#0E1833",
  "#0A0624",
  "#10121A",
] as const;

const lightGradientColors = [
  "#F8FBFF",
  "#EAF2FF",
  "#E3ECFF",
  "#F8FBFF",
] as const;

const defaultLocations = [0, 0.43, 0.75, 1] as const;

const GradientView = ({
  colors,
  locations = defaultLocations,
  style,
  children,
}: GradientViewProps) => {
  const { colorScheme } = useAppTheme();

  const defaultColors =
    colorScheme === "dark" ? darkGradientColors : lightGradientColors;

  return (
    <LinearGradient
      colors={colors ?? defaultColors}
      locations={locations}
      style={[styles.container, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientView;
