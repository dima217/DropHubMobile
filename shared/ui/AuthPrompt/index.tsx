import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AuthPromptProps {
  promptText: string;
  actionText: string;
  onPressAction: () => void;
}

const AuthPrompt: React.FC<AuthPromptProps> = ({
  onPressAction,
  promptText,
  actionText,
}) => {
  return (
    <View style={styles.container}>
      <ThemedText type="link" style={styles.baseText}>
        {promptText}
      </ThemedText>
      <Pressable onPress={onPressAction} style={{ padding: 0 }}>
        <ThemedText type="link" style={styles.highlightText}>
          {actionText}
        </ThemedText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
    backgroundColor: "transparent",
    gap: 5,
    display: "flex",
    flexDirection: "row",
  },
  baseText: {
    color: Colors.secondary,
    fontWeight: "200",
  },
  highlightText: {
    color: Colors.primary,
    fontWeight: "300",
    paddingHorizontal: 2,
  },
});

export default AuthPrompt;
