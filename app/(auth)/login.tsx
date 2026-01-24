import { Colors } from "@/constants/design-tokens";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import View from "@/shared/View";
import LoginForm from "@/widgets/login/LoginForm";
import { useRouter } from "expo-router";
import { View as RNView, StyleSheet } from "react-native";

const Login = () => {
  const router = useRouter();

  return (
    <View>
      <RNView style={styles.container}>
        <RNView style={styles.iconContainer}>
          {/* <Icon width={68} height={68} /> */}
          {/* <ThemedText>Login</ThemedText> */}
        </RNView>
        <LoginForm />
      </RNView>
      <RNView style={styles.innerContainer}>
        <AuthPrompt
          promptText="Don't have an account?"
          actionText="Sign Up"
          onPressAction={() => router.navigate("/(auth)/register")}
        />
      </RNView>
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
