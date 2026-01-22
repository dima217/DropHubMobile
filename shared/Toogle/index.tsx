import { Colors } from "@/constants/design-tokens";
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
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option, index) => {
        const isActive = selected === option;

        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.button,
              {
                backgroundColor: isActive ? Colors.primary : Colors.inactive,
              },

              style,
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.8}
          >
            <ThemedText
              style={{ color: isActive ? Colors.text : "#8B868F" }}
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
