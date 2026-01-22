import { Colors, Fonts } from "@/constants/design-tokens";
import { StyleSheet, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  type?:
    | "default"
    | "title"
    | "defaultSemiBold"
    | "subtitle"
    | "link"
    | "error"
    | "small";
  fontFamilyType?: "sans" | "serif" | "rounded" | "mono";
};

export function ThemedText({
  style,
  type = "default",
  fontFamilyType = "sans",
  ...rest
}: ThemedTextProps) {
  return (
    <Text
      style={[
        { color: Colors.text, fontFamily: Fonts[fontFamilyType] },
        typeStyles[type],
        style,
      ]}
      {...rest}
    />
  );
}

const typeStyles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 28,
  },
  link: {
    lineHeight: 24,
    fontSize: 14,
    color: Colors.primary,
  },
  small: {
    fontSize: 10,
  },
  error: {
    width: "90%",
    color: "red",
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
});
