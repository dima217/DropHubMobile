import { Text, TouchableOpacity } from "react-native";

import type { StyleProp, TextStyle, ViewStyle } from "react-native";

import ActivityIndicator from "../ui/ActivityIndicator";

import { useThemeColors } from "@/hooks/useThemeColors";
import { useI18n } from "@/shared/localization";
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
  const { tl } = useI18n();
  const colors = useThemeColors();
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      disabled={isDisabled}
      style={[
        styles.container,
        { backgroundColor: buttonColor ?? colors.primary },
        isDisabled && { backgroundColor: colors.secondary },
        style,
      ]}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.inactive} />
      ) : (
        <Text
          style={[
            styles.buttonText,
            { color: textColor ?? colors.text },
            isDisabled && { color: colors.inactive },
            textStyle,
          ]}
        >
          {tl(title)}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
