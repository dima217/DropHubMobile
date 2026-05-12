import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import Header from "@/shared/Header";
import WaveButton from "@/shared/ui/animated/WaveButton";
import View from "@/shared/View";
import { useRouter } from "expo-router";
import React from "react";
import { View as RNView, StyleSheet } from "react-native";

interface RoomPlaceholderProps {
  onAddFiles?: () => void;
}

const RoomPlaceholder: React.FC<RoomPlaceholderProps> = ({ onAddFiles }) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: "16%",
    alignItems: "center",
    gap: 30,
  },
  textContainer: {
    alignItems: "center",
    gap: 12,
    marginBottom: "20%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: c.brightText,
    textAlign: "center",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 18,
    color: c.text,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: c.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  hintContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  hint: {
    fontSize: 12,
    color: c.secondary,
    textAlign: "center",
  },

}));

  const router = useRouter();

  const handleAddFiles = () => {
    if (onAddFiles) {
      onAddFiles();
    } else {
      console.log("Add files to room");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="New Files" />
      
      <RNView style={styles.content}>
        <RNView style={styles.textContainer}>
          <ThemedText style={styles.title}>
            Start Sharing
          </ThemedText>
          <ThemedText style={styles.description}>
            DropHub makes it easy to collaborate and share resources. 
            Click the button below to add your first files.
          </ThemedText>
        </RNView>

        <WaveButton
          onPress={handleAddFiles}
          color={themeColors.primary}
          icon="plus"
          size={100}
        />

        <RNView style={styles.hintContainer}>
          <ThemedText style={styles.hint}>
            Tap the button to upload files
          </ThemedText>
        </RNView>
      </RNView>
    </View>
  );
};

export default RoomPlaceholder;
