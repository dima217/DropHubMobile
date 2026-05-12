import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ReactNode } from "react";
import {
    StyleProp,
    TouchableOpacity,
    View,
    ViewStyle
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
  color,
  size = 50,
  fluid = false,
  gesture,
  onPress,
  children,
  style,
}: CircleProps) => {
  const themeColors = useThemeColors();
  const fillColor = color ?? themeColors.primary;
  const styles = useThemedStyles((c) => ({

  circle: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

}));

  const circleStyle: ViewStyle = fluid
    ? {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 9999,
        backgroundColor: fillColor,
      }
    : {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: fillColor,
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

export default Circle;
