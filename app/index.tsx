// app/index.tsx
import { RootState } from "@/store/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function RootRedirect() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const loading = useSelector((state: RootState) => state.auth.loading);
  
  // Log for debugging (will be removed in release by ProGuard)
  console.log('RootRedirect - isAuth:', isAuth, 'loading:', loading);

  // Wait for auth state to load before redirecting
  if (loading) {
    return null; // or a loading spinner
  }

  if (isAuth) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
