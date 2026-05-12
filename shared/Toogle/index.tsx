import { useThemeColors } from "@/hooks/useThemeColors";
import { memo } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import { ThemedText } from "../core/ThemedText";
import { styles } from "./styles";

type Props = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  containerStyle?: ViewStyle;
  style?: ViewStyle;
};

const ToggleButtons = ({
  options,
  selected,
  onSelect,
  style,
  containerStyle,
}: Props) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isActive = selected === option;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? colors.primary : colors.inactive,
              },
              style,
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
          >
            <ThemedText
              style={{ color: isActive ? colors.brightText : colors.secondary }}
              type="small"
            >
              {option}
            </ThemedText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default memo(ToggleButtons);
