import TextInput from "../TextInput";

import type { TextInputProps } from "../TextInput";

interface EmailInputProps extends TextInputProps {
  label?: string;
}

const EmailInput = ({
  label = "Email",
  placeholder = "Email",
  ...rest
}: EmailInputProps) => {
  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      inputMode="email"
      keyboardType="email-address"
      textContentType="emailAddress"
      autoComplete="email"
      importantForAutofill="yes"
      autoCorrect={false}
      autoCapitalize="none"
      {...rest}
    />
  );
};

export default EmailInput;
