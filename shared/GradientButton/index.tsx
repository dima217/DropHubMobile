import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";

import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import { Colors } from "@/constants/design-tokens";

import ActivityIndicator from "@/shared/ui/ActivityIndicator";

import styles from "./styles";

const disabledGradient = [Colors.inactive, Colors.secondary] as const;

interface GradientButtonProps {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  gradientStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const GradientButton = ({
  title,
  onPress,
  loading,
  disabled,
  textColor,
  style,
  gradientStyle,
  textStyle,
}: GradientButtonProps) => {
  const isDisabled = disabled || loading;

  const gradientColors = isDisabled ? disabledGradient : Colors.gradient;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[styles.touchableContainer, isDisabled && styles.outline, style]}
      onPress={onPress}
    >
      <LinearGradient
        colors={gradientColors}
        style={[styles.gradientContainer, gradientStyle]}
        start={{ x: 0.5, y: 0.5 }}
        end={{ x: 0.5, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator size="small" color={Colors.inactive} />
        ) : (
          <Text
            style={[
              styles.buttonText,
              {
                color:
                  textColor ?? (isDisabled ? Colors.inactive : Colors.text),
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default GradientButton;
