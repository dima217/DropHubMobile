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
  fluid?: boolean;
  color?: string;
  onPress?: () => void;
  gesture?: any;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const Circle = ({
  color = Colors.primary,
  size = 50,
  fluid = false,
  gesture,
  onPress,
  children,
  style,
}: CircleProps) => {
  const circleStyle: ViewStyle = fluid
    ? {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 9999,
        backgroundColor: color,
      }
    : {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      };

  const content = (
    <View style={[circleStyle, styles.circle, style]}>{children}</View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }

  if (gesture) {
    return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
  }

  return content;
};

const styles = StyleSheet.create({
  circle: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
});

export default Circle;
