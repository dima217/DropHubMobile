//import { useTranslation } from "@/hooks/useTranslation";
import { ThemedText } from "@/shared/core/ThemedText";
import EmailInput from "@/shared/EmailInput";
import TextInput from "@/shared/TextInput";
import { useRouter } from "expo-router";

import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const EmailScreen = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  //const { t } = useTranslation();
  const router = useRouter();

  const getErrorMessage = (field: string): string | undefined => {
    const error = errors[field];
    if (error && error.message) {
      return String(error.message);
    }
    return undefined;
  };

  return (
    <View style={styles.stepContainer}>
      <ThemedText type="megaTitle" style={styles.title}>
        Sign Up
      </ThemedText>
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
        <Controller
          control={control}
          name="username"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label={"Username"}
              placeholder={"User123"}
              value={value}
              errorMessage={getErrorMessage("username")}
              onChangeText={onChange}
              autoCapitalize="words"
            />
          )}
        />
        <View style={styles.innerContainer}></View>
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
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  title: {
    marginBottom: 20,
  },
  inputWrapper: {
    width: "100%",
    gap: 10,
  },
});

export default EmailScreen;
