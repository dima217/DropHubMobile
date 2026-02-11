// app/index.tsx
import { RootState } from "@/store/store";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";

export default function RootRedirect() {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  console.log(isAuth);

  if (isAuth) {
    return <Redirect href="/(tabs)/home" />;
  } else {
    return <Redirect href="/onboarding" />;
  }
}
