import { Ionicons } from "@expo/vector-icons";

import { useToggle } from "@/hooks/useToggle";

import TextInput from "../TextInput";

import { Colors } from "@/constants/design-tokens";
import type { TextInputProps } from "../TextInput";

interface PasswordInputProps extends TextInputProps {
  label?: string;
}

const PasswordInput = ({
  label = "Password",
  placeholder = "*******",
  ...rest
}: PasswordInputProps) => {
  const { state: visible, toggle } = useToggle();

  const iconName = visible ? "eye-off" : "eye";

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      secureTextEntry={!visible}
      right={
        <Ionicons
          name={iconName}
          size={20}
          color={Colors.secondary}
          onPress={toggle}
        />
      }
      textContentType="password"
      autoComplete="password"
      importantForAutofill="yes"
      autoCorrect={false}
      autoCapitalize="none"
      {...rest}
    />
  );
};

export default PasswordInput;
