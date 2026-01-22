import { useSignUpMutation } from "@/api";
import { secureStore } from "@/services/secureStore";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import Button from "../../../shared/Button";
import EmailInput from "../../../shared/EmailInput";
import PasswordInput from "../../../shared/PasswordInput";
import TextInput from "../../../shared/TextInput";
import { ThemedText } from "../../../shared/core/ThemedText";

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignUpForm = () => {
  const { handleSubmit, control } = useForm<SignUpData>();

  const router = useRouter();
  const [signUp, { isLoading }] = useSignUpMutation();
  const dispatch = useDispatch();
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (userData: SignUpData) => {
    setApiError(null);

    try {
      const result = await signUp({
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      }).unwrap();

      if (result.accessToken) {
        await secureStore.setAccessToken(result.accessToken);
      }
      if (result.refreshToken) {
        await secureStore.setRefreshToken(result.refreshToken);
      }

      dispatch(
        setCredentials({
          user: userData,
          accessToken: result.accessToken,
        })
      );

      router.navigate("/(tabs)/home");
    } catch (error: any) {
      let errorMessage = "An unexpected error occurred.";

      const data = error.data as { message?: string } | undefined;

      if (data?.message) {
        errorMessage = data.message;
      } else if (error.status === "FETCH_ERROR") {
        errorMessage = "Network Error. Check your connection.";
      }

      setApiError(errorMessage);
    }
  };

  return (
    <View style={styles.container}>
      {apiError && (
        <ThemedText type="error" style={styles.apiErrorText}>
          {apiError}
        </ThemedText>
      )}

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
          <>
            <EmailInput
              value={value}
              onChangeText={onChange}
              placeholder="Email"
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
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
          <>
            <PasswordInput
              value={value}
              onChangeText={onChange}
              placeholder="Password"
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name="firstName"
        rules={{ required: "First Name is required" }}
        render={({ field: { value, onChange }, fieldState }) => (
          <>
            <TextInput
              label="Name"
              value={value}
              onChangeText={onChange}
              placeholder="First Name"
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
      <Controller
        control={control}
        name="lastName"
        rules={{ required: "Last Name is required" }}
        render={({ field: { value, onChange }, fieldState }) => (
          <>
            <TextInput
              label="Surname"
              value={value}
              onChangeText={onChange}
              placeholder="Last Name"
              errorMessage={fieldState.error?.message}
            />
          </>
        )}
      />
      <Button
        title="Register"
        loading={isLoading}
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    gap: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 60,
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

export default SignUpForm;
