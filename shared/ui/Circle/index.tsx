import { Colors } from "@/constants/design-tokens";
import { ReactNode } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { GestureDetector } from "react-native-gesture-handler";

interface CircleProps {
  size?: number;
  color?: string;
  onPress?: () => void;
  gesture?: any;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Circle = ({
  color = Colors.primary,
  size = 50,
  gesture,
  onPress,
  children,
  style,
}: CircleProps) => {
  const circleStyle: ViewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={[circleStyle, styles.circle, style]}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  if (gesture) {
    return (
      <GestureDetector gesture={gesture}>
        <View style={[circleStyle, styles.circle, style]}>{children}</View>
      </GestureDetector>
    );
  }

  return <View style={[circleStyle, styles.circle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default Circle;
