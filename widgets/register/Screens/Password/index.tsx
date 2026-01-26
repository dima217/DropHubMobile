import { ThemedText } from "@/shared/core/ThemedText";
import PasswordInput from "@/shared/PasswordInput";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const PasswordScreen = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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
          Create Password
        </ThemedText>
        <ThemedText type="medium" style={styles.subtitle}>
          The password must contain at least 8 characters, 1 special character
          and 1 uppercase letter
        </ThemedText>
      </View>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange } }) => (
            <PasswordInput
              value={value}
              errorMessage={getErrorMessage("password")}
              onChangeText={onChange}
              placeholder={"******"}
            />
          )}
        />
        <Controller
          control={control}
          name="confirm"
          render={({ field: { value, onChange } }) => (
            <PasswordInput
              value={value}
              label="Confirm"
              errorMessage={getErrorMessage("confirm")}
              onChangeText={onChange}
              placeholder={"******"}
            />
          )}
        />
      </View>
    </View>
  );
};

export default PasswordScreen;

const styles = StyleSheet.create({
  stepContainer: {
    width: "100%",
    gap: 30,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    opacity: 0.7,
  },
  inputWrapper: {
    width: "100%",
  },
});
