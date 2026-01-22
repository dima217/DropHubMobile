import { Text, TouchableOpacity } from "react-native";

import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import ActivityIndicator from "../ui/ActivityIndicator";

import { Colors } from "@/constants/design-tokens";
import { styles } from "./styles";

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  buttonColor?: string;
  textColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = ({
  title,
  onPress,
  loading,
  disabled,
  buttonColor,
  textColor,
  style,
  textStyle,
}: ButtonProps) => {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        styles.container,
        { backgroundColor: buttonColor ?? Colors.primary },
        isDisabled && { backgroundColor: Colors.secondary },
        style,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.inactive} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: textColor ?? Colors.text },
            isDisabled && { color: Colors.inactive },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
