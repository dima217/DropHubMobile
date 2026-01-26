import { ThemedText } from "@/shared/core/ThemedText";
import TextInput from "@/shared/TextInput";
import { useRouter } from "expo-router";
import { Controller, useFormContext } from "react-hook-form";
import { StyleSheet, View } from "react-native";

const CodeScreen = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
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
      <View style={styles.infoContainer}>
        <ThemedText type="megaTitle" style={styles.title}>
          Verify Email
        </ThemedText>
        <ThemedText type="medium">
          We&apos;ve sent you a 6-digit code via email. If you haven&apos;t
          received the code, please request it again or check your spam folder
        </ThemedText>
      </View>
      <View style={styles.inputWrapper}>
        <Controller
          control={control}
          name="code"
          render={({ field: { value, onChange } }) => (
            <TextInput
              label="Verification Code"
              placeholder="XXX-XXX"
              value={value}
              errorMessage={getErrorMessage("code")}
              onChangeText={onChange}
              keyboardType="numeric"
              maxLength={6}
              autoFocus
            />
          )}
        />
      </View>
      <View style={styles.innerContainer}></View>
    </View>
  );
};

export default CodeScreen;

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
    marginTop: "2%",
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
  infoContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: "6%",
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 20,
    textAlign: "center",
    opacity: 0.7,
  },
  inputWrapper: {
    width: "100%",
  },
});
