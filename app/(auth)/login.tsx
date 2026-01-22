import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import LoginForm from "@/widgets/login/LoginForm";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Icon from "../../assets/images/flash.svg";

const Login = () => {
  const router = useRouter();

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon width={68} height={68} />
          <ThemedText>Login</ThemedText>
        </View>
        <LoginForm />
      </View>
      <View style={styles.innerContainer}>
        <AuthPrompt
          promptText="Don't have an account?"
          actionText="Sign Up"
          onPressAction={() => router.navigate("/(auth)/register")}
        />
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: "15%",
    width: "100%",
    alignItems: "center",
  },
});
