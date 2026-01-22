import { RootState } from "@/store/store";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";

export default function AuthChecker() {
  const router = useRouter();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  useFocusEffect(
    useCallback(() => {
      if (!isAuth) {
        router.replace("/(auth)/login");
      }
    }, [isAuth, router])
  );

  useEffect(() => {
    if (!isAuth) {
      router.replace("/(auth)/login");
    }
  }, [isAuth, router]);

  return null;
}
