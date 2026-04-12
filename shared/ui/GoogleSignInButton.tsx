import { GOOGLE_WEB_CLIENT_ID } from "@/constants/googleAuth";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import Button from "@/shared/Button";
import { Alert, Platform, StyleProp, ViewStyle } from "react-native";

type Props = {
  title?: string;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function GoogleSignInButton({
  title = "Continue with Google",
  style,
  disabled = false,
}: Props) {
  const { signInWithGoogle, loading } = useGoogleAuth();

  const onPress = () => {
    if (Platform.OS === "web") {
      Alert.alert("Google Sign-In", "Доступно в мобильной сборке (Android / iOS).");
      return;
    }
    if (!GOOGLE_WEB_CLIENT_ID) {
      Alert.alert(
        "Google Sign-In",
        "Задайте expo.extra.googleWebClientId в app.json (Web client ID из Google Cloud Console)."
      );
      return;
    }
    void signInWithGoogle();
  };

  return (
    <Button
      title={title}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={style}
    />
  );
}
