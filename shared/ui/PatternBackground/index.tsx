import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Defs, Path, Pattern, Rect } from "react-native-svg";

interface PatternBackgroundProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  size?: number;
  gap?: number;
}

const PatternBackground: React.FC<PatternBackgroundProps> = ({
  style,
  color = "rgba(255,255,255,0.05)",
  size = 20,
  gap = 40,
}) => {
  return (
    <View style={[style, styles.container]}>
      <Svg height="100%" width="100%">
        <Defs>
          <Pattern
            id="iconPattern"
            patternUnits="userSpaceOnUse"
            width={gap}
            height={gap}
          >
            <Path d="M2 2 L10 10 M10 2 L2 10" stroke={color} strokeWidth={1} />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#iconPattern)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    overflow: "hidden",
  },
});

export default PatternBackground;
