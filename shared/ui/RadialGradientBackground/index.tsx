import { Colors } from "@/constants/design-tokens";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

interface RadialGradientBackgroundProps {
  colors?: string[] | [string, string] | [string, string, string];
  opacities?: number[] | [number, number] | [number, number, number];
  offsets?: number[];
  cx?: string;
  cy?: string;
  r?: string;
  fx?: string;
  fy?: string;
  style?: StyleProp<ViewStyle>;
}

const RadialGradientBackground: React.FC<RadialGradientBackgroundProps> = ({
  colors = [Colors.gradientPrimary, Colors.gradientPrimary],
  opacities,
  offsets,
  cx = "60%",
  cy = "40%",
  r = "50%",
  fx = "50%",
  fy = "20%",
  style,
}) => {
  const colorsArray = colors.slice(0, 3);
  const colorsCount = colorsArray.length;

  const getOpacities = (): number[] => {
    if (opacities) {
      return opacities;
    }
    return Array.from({ length: colorsCount }, (_, i) => 
      colorsCount > 1 ? 0.3 * (1 - i / (colorsCount - 1)) : 0.3
    );
  };

  const getOffsets = (): number[] => {
    if (offsets) {
      return offsets;
    }
    return Array.from({ length: colorsCount }, (_, i) => 
      colorsCount > 1 ? (i / (colorsCount - 1)) * 100 : 0
    );
  };

  const calculatedOpacities = getOpacities();
  const calculatedOffsets = getOffsets();

  return (
    <View style={[styles.container, style]}>
      <Svg height="100%" width="100%">
        <Defs>
          <RadialGradient id="grad" cx={cx} cy={cy} r={r} fx={fx} fy={fy}>
            {colorsArray.map((color, i) => {
              const opacity = calculatedOpacities[i] ?? 0;
              const offset = calculatedOffsets[i] ?? 0;

              return (
                <Stop
                  key={i}
                  offset={`${offset}%`}
                  stopColor={color}
                  stopOpacity={opacity}
                />
              );
            })}
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
});

export default RadialGradientBackground;
