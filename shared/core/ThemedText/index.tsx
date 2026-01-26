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
    | "small"
    | "medium"
    | "megaTitle";
  fontFamilyType?: "sans" | "serif" | "rounded" | "mono";
  highlightLastWord?: boolean;
};

export function ThemedText({
  style,
  type = "default",
  fontFamilyType = "sans",
  highlightLastWord = false,
  children,
  ...rest
}: ThemedTextProps) {
  if (highlightLastWord && typeof children === "string") {
    const words = children.trim().split(" ");
    const lastWord = words.pop();
    const restText = words.join(" ");

    return (
      <Text
        style={[
          { color: Colors.text, fontFamily: Fonts[fontFamilyType] },
          typeStyles[type],
          style,
        ]}
        {...rest}
      >
        {restText ? restText + " " : ""}
        <Text style={{ color: Colors.primary }}>{lastWord}</Text>
      </Text>
    );
  }

  return (
    <Text
      style={[
        { color: Colors.text, fontFamily: Fonts[fontFamilyType] },
        typeStyles[type],
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
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
  megaTitle: {
    fontSize: 26,
    color: Colors.brightText,
    lineHeight: 50,
  },
  link: {
    lineHeight: 24,
    fontSize: 14,
    color: Colors.primary,
  },
  medium: {
    fontSize: 12,
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
