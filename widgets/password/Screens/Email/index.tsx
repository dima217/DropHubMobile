//import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import EmailInput from "@/shared/EmailInput";

import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const ResetPasswordEmailScreen = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  //const { t } = useTranslation();

  const getErrorMessage = (field: string): string | undefined => {
    const error = errors[field];
    if (error && error.message) {
      return String(error.message);
    }
    return undefined;
  };

  return (
    <View style={styles.stepContainer}>
      <View style={styles.infoContainer}>
        <ThemedText type="megaTitle" style={styles.title}>
            Reset Password
        </ThemedText>
        <ThemedText type="medium">
            Enter your email to receive a password reset code
        </ThemedText>
      </View>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange } }) => (
            <EmailInput
              value={value}
              errorMessage={getErrorMessage("email")}
              onChangeText={onChange}
              placeholder="Enter your email"
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    gap: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    gap: 10,
  },
  infoContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
});

export default ResetPasswordEmailScreen;
