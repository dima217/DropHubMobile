import { useThemeColors } from "@/hooks/useThemeColors";
import { useI18n } from "@/shared/localization";
import React, { useMemo } from "react";
import { TextInput as RNTextInput, Text, View } from "react-native";

import type {
  TextInputProps as RNTextInputProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from "react-native";

import createTextInputStyles from "./styles";

export interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  errorMessage?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  left?: React.ReactNode;
  right?: React.ReactNode;
}

const TextInput = ({
  label,
  errorMessage,
  style,
  inputStyle,
  left,
  right,
  editable = true,
  multiline,
  ...rest
}: TextInputProps) => {
  const { tl } = useI18n();
  const colors = useThemeColors();
  const styles = useMemo(() => createTextInputStyles(colors), [colors]);
  const hasError = Boolean(errorMessage);
  const localizedLabel = label ? tl(label) : undefined;
  const localizedError = errorMessage ? tl(errorMessage) : undefined;
  const localizedPlaceholder =
    typeof rest.placeholder === "string" ? tl(rest.placeholder) : rest.placeholder;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{localizedLabel}</Text>
      </View>
      <View
        style={[
          styles.inputContainer,
          multiline && styles.inputContainerMultiline,
          hasError && styles.errorInputContainer,
          !editable && styles.disabledInputContainer,
        ]}
      >
        {left && <View style={styles.leftContainer}>{left}</View>}
        <RNTextInput
          style={[styles.input, multiline && styles.inputMultiline, inputStyle]}
          editable={editable}
          enablesReturnKeyAutomatically
          multiline={multiline}
          placeholderTextColor={colors.secondary}
          {...rest}
          placeholder={localizedPlaceholder}
        />
        {right && <View style={styles.rightContainer}>{right}</View>}
      </View>
      <View style={styles.errorContainer}>
        <Text style={styles.error}>{localizedError}</Text>
      </View>
    </View>
  );
};

export default TextInput;
