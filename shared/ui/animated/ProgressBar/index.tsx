/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar = ({ progress }: ProgressBarProps) => {
  const sharedValue = useSharedValue(0);
  const clampedProgress = Math.max(0, Math.min(100, progress)) / 100;

  useEffect(() => {
    sharedValue.value = withTiming(clampedProgress, { duration: 1000 });
  }, [clampedProgress]);

  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      transformOrigin: "left center",
      width: "100%",
      transform: [{ scaleX: sharedValue.value }],
    };
  });

  return (
    <View style={styles.progressBarWrapper}>
      <Animated.View style={[styles.progressBar, animatedBarStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  progressBarWrapper: {
    height: 10,
    backgroundColor: "#333333",
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 5,
  },
});

export default ProgressBar;
