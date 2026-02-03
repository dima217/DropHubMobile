import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import ProgressBar from "@/shared/ui/animated/ProgressBar";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from "react-native-reanimated";

// Helper function to format bytes
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

interface StorageCardProps {
  used?: number;
  total?: number;
  activeRoomsCount?: number;
}

const StorageCard = React.memo(({ 
  used = 2.5 * 1024 * 1024 * 1024, // Mock: 2.5GB
  total = 10 * 1024 * 1024 * 1024, // Mock: 10GB
  activeRoomsCount = 0,
}: StorageCardProps) => {
  // Static progress value for now (API not ready)
  const progress = 25; // 25% usage
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  React.useEffect(() => {
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withSpring(0, { damping: 15 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.storageCard, animatedStyle]}>
      <ThemedText type="subtitle" style={styles.storageCardTitle}>
        Хранилище
      </ThemedText>
      <ThemedText type="megaTitle" style={styles.storageCardValue}>
        {formatBytes(used)}
      </ThemedText>
      <ThemedText type="small" style={styles.storageCardSubtitle}>
        из {formatBytes(total)} использовано
      </ThemedText>
      <ProgressBar progress={progress} />
      
      <Animated.View style={styles.roomsSection}>
        <ThemedText type="subtitle" style={styles.roomsTitle}>
          Активных комнат
        </ThemedText>
        <ThemedText type="title" style={styles.roomsValue}>
          {activeRoomsCount}
        </ThemedText>
      </Animated.View>
    </Animated.View>
  );
});

StorageCard.displayName = "StorageCard";

const styles = StyleSheet.create({
  storageCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storageCardTitle: {
    color: Colors.text,
    marginBottom: 8,
  },
  storageCardValue: {
    color: Colors.brightText,
    marginBottom: 4,
  },
  storageCardSubtitle: {
    color: Colors.secondary,
    marginBottom: 16,
  },
  roomsSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  roomsTitle: {
    color: Colors.text,
    marginBottom: 8,
  },
  roomsValue: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: "700",
  },
});

export default StorageCard;

