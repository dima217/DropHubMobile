import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withSpring,
    withTiming,
} from "react-native-reanimated";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delay?: number;
}

const StatCard = React.memo(({ 
  title, 
  value, 
  subtitle,
  delay = 0 
}: StatCardProps) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  const scale = useSharedValue(0.9);

  React.useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }));
    translateY.value = withDelay(delay, withSpring(0, { damping: 15 }));
    scale.value = withDelay(delay, withSpring(1, { damping: 15 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={[styles.statCard, animatedStyle]}>
      <ThemedText type="subtitle" style={styles.statCardTitle}>
        {title}
      </ThemedText>
      <ThemedText type="title" style={styles.statCardValue}>
        {value}
      </ThemedText>
    </Animated.View>
  );
});

StatCard.displayName = "StatCard";

const styles = StyleSheet.create({
  statCard: {
    borderRadius: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",  
    gap: 10,
  },
  statCardTitle: {
    color: Colors.text,
  },
  statCardValue: {
    color: Colors.primary,
    fontSize: 32,
    fontWeight: "700",
  },
  statCardSubtitle: {
    color: Colors.secondary,
    marginTop: 4,
  },
});

export default StatCard;

