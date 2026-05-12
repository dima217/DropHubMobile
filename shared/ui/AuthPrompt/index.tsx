import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface AuthPromptProps {
  promptText: string;
  actionText: string;
  onPressAction: () => void;
  textType?: "link" | "medium";
}

const AuthPrompt: React.FC<AuthPromptProps> = ({
  onPressAction,
  promptText,
  actionText,
  textType = "link",
}) => {
  const styles = useThemedStyles((c) => ({

  container: {
    backgroundColor: "transparent",
    gap: 5,
    display: "flex",
    flexDirection: "row",
  },
  baseText: {
    color: c.secondary,
    fontWeight: "200",
  },
  highlightText: {
    color: c.primary,
    fontWeight: "300",
    paddingHorizontal: 2,
  },

}));

  return (
    <View style={styles.container}>
      <ThemedText type={textType} style={styles.baseText}>
        {promptText}
      </ThemedText>
      <Pressable onPress={onPressAction} style={{ padding: 0 }}>
        <ThemedText type={textType} style={styles.highlightText}>
          {actionText}
        </ThemedText>
      </Pressable>
    </View>
  );
};

export default AuthPrompt;
