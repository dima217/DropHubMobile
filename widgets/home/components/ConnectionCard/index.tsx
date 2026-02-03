import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const ConnectionCard = React.memo(() => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const glowOpacity = useSharedValue(0.3);
  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handlePress = () => {
    router.push("/(tabs)/search/connections-search");
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const gradientAnimatedStyle = useAnimatedStyle(() => {
    const rotation = rotate.value;
    return {
      transform: [{ rotate: `${rotation}deg` }],
      opacity: glowOpacity.value,
    };
  });

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}deg` },
    ],
  }));

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
    >
      <Animated.View style={[styles.connectionCard, cardAnimatedStyle]}>
        <Animated.View style={[styles.connectionGradient, gradientAnimatedStyle]} />
        <LinearGradient
          colors={[Colors.cardBackground, "rgba(39, 136, 230, 0.1)"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.connectionContent}
        >
          <Animated.View style={iconAnimatedStyle}>
            <Feather name="user-plus" size={32} color={Colors.primary} />
          </Animated.View>
          <ThemedText type="subtitle" style={styles.connectionTitle}>
            Добавить коннект
          </ThemedText>
          <ThemedText type="small" style={styles.connectionSubtitle}>
            Расширьте свою сеть и начните сотрудничать
          </ThemedText>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
});

ConnectionCard.displayName = "ConnectionCard";

const styles = StyleSheet.create({
  connectionCard: {
    marginTop: 24,
    borderRadius: 24,
    overflow: "hidden",
    position: "relative",
  },
  connectionGradient: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width,
    backgroundColor: Colors.primary,
    top: -width * 0.5,
    left: -width * 0.25,
  },
  connectionContent: {
    padding: 24,
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  connectionTitle: {
    color: Colors.brightText,
    marginTop: 16,
    marginBottom: 8,
    fontWeight: "600",
  },
  connectionSubtitle: {
    color: Colors.text,
    textAlign: "center",
  },
});

export default ConnectionCard;

