import { useGoogleNativeSignInMutation } from "@/api/authApi";
import { completeGoogleAuthSession } from "@/services/auth/completeGoogleAuthSession";
import { ensureGoogleSignInConfigured } from "@/services/google/configureGoogleSignIn";
import type { AppDispatch } from "@/store/store";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Platform } from "react-native";
import { useDispatch } from "react-redux";

export function useGoogleAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [googleNativeSignIn] = useGoogleNativeSignInMutation();
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = useCallback(async () => {
    if (Platform.OS === "web") {
      Alert.alert("Google Sign-In", "Доступно в мобильной сборке (Android / iOS).");
      return;
    }

    setLoading(true);
    try {
      ensureGoogleSignInConfigured();
      if (Platform.OS === "android") {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
      }

      try {
        await GoogleSignin.signOut();
      } catch {}

      const signInResult = await GoogleSignin.signIn();
      if (signInResult.type !== "success") {
        return;
      }

      let idToken = signInResult.data.idToken;
      if (!idToken) {
        const tokens = await GoogleSignin.getTokens();
        idToken = tokens.idToken;
      }
      if (!idToken) {
        throw new Error(
          "Google не вернул idToken. Проверьте Web client ID в GoogleSignin.configure и тип клиента в консоли Google Cloud."
        );
      }

      const tokens = await googleNativeSignIn({ idToken }).unwrap();
      const googleAccountEmail = signInResult.data.user.email;
      await completeGoogleAuthSession(dispatch, tokens, { googleAccountEmail });
      router.replace("/(tabs)/home");
    } catch (e: unknown) {
      const err = e as { data?: { message?: string }; message?: string };
      const msg =
        err?.data?.message ??
        err?.message ??
        (typeof e === "string" ? e : "Ошибка входа через Google");
      Alert.alert("Google Sign-In", String(msg));
    } finally {
      setLoading(false);
    }
  }, [dispatch, googleNativeSignIn, router]);

  return { signInWithGoogle, loading };
}
