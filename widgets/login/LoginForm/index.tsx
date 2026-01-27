import { useSignInMutation } from "@/api";
import { secureStore } from "@/services/secureStore";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import AuthPrompt from "@/shared/ui/AuthPrompt";
import Button from "../../../shared/Button";
import EmailInput from "../../../shared/EmailInput";
import PasswordInput from "../../../shared/PasswordInput";
import { ThemedText } from "../../../shared/core/ThemedText";

interface LoginData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const { handleSubmit, control } = useForm<LoginData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [signIn, { isLoading }] = useSignInMutation();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (userData: LoginData) => {
    setApiError(null);

    try {
      const result = await signIn({
        email: userData.email,
        password: userData.password,
      }).unwrap();

      console.log(`accessToken: ${result.accessToken}`);
      if (result.accessToken) {
        await secureStore.setAccessToken(result.accessToken);
      }

      console.log(`refresh: ${result.refreshToken}`);
      if (result.refreshToken) {
        await secureStore.setRefreshToken(result.refreshToken);
      }

      dispatch(
        setCredentials({
          user: {
            ...userData,
            ...result.user.profile,
          },
          accessToken: result.accessToken,
        })
      );

      router.replace("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "Login failed!";

      if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.error) {
        errorMessage = error.error;
      }
      setApiError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="email"
        rules={{
          required: "Email is required",
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: "Email is not valid",
          },
        }}
        render={({ field: { value, onChange }, fieldState }) => (
          <EmailInput
            value={value}
            onChangeText={onChange}
            errorMessage={fieldState.error?.message}
          />
        )}
      />

      <View style={styles.passwordContainer}>
        <Controller
          control={control}
          name="password"
          rules={{
            required: "Password is required",
            minLength: {
              value: 6,
              message: "Password must be at least 6 characters",
            },
          }}
          render={({ field: { value, onChange }, fieldState }) => (
            <PasswordInput
              value={value}
              onChangeText={onChange}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
        <View style={styles.resetTextContainer}>
          <AuthPrompt
            textType="medium"
            promptText="Forgot Password?"
            actionText="Reset"
            onPressAction={() => router.navigate("/(auth)/reset-password")}
          />
        </View>
      </View>

      {apiError && (
        <ThemedText type="error" style={styles.apiErrorText}>
          {apiError}
        </ThemedText>
      )}

      <Button
        title="Login"
        loading={isLoading}
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  passwordContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  resetTextContainer: {
    marginRight: 20,
  },
  button: {
    marginTop: 30,
  },
  errorText: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 12,
  },
  apiErrorText: {
    color: "red",
    marginVertical: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default LoginForm;
