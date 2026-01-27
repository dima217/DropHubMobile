import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import Header from "@/shared/Header";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import View from "@/shared/View";
import LoginForm from "@/widgets/login/LoginForm";
import { useRouter } from "expo-router";
import { View as RNView, StyleSheet } from "react-native";

const Login = () => {
  const router = useRouter();

  return (
    <View>
      <Header />
      <RNView style={styles.container}>
        <RNView style={styles.iconContainer}>
          <ThemedText style={styles.loginText}>Sign In</ThemedText>
        </RNView>
        <LoginForm />
        <RNView style={styles.innerContainer}>
          <AuthPrompt
            promptText="Don't have an account?"
            actionText="Sign Up"
            onPressAction={() => router.navigate("/(auth)/register")}
          />
        </RNView>
      </RNView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: "20%",
    alignItems: "center",
  },
  iconContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 15,
    marginBottom: 50,
  },
  loginText: {
    fontSize: 26,
    color: Colors.brightText,
    lineHeight: 50,
  },
  innerContainer: {
    display: "flex",
    flexDirection: "column",
    marginTop: "2%",
    gap: 10,
    width: "100%",
    alignItems: "center",
  },
});
