import AuthPrompt from "@/shared/ui/AuthPrompt";
import View from "@/shared/View";
import SignUpForm from "@/widgets/register/SignUpForm";
import { useRouter } from "expo-router";
import { View as RNView, StyleSheet } from "react-native";

const SignUp = () => {
  const router = useRouter();
  return (
    <View>
      <RNView style={styles.container}>
        <RNView style={styles.iconContainer}>
          {/* <Icon width={68} height={68} /> */}
          {/* <ThemedText>Sign Up</ThemedText> */}
        </RNView>
        <SignUpForm />
      </RNView>
      <RNView style={styles.innerContainer}>
        <AuthPrompt
          promptText="Already have an account?"
          actionText="Login"
          onPressAction={() => router.navigate("/(auth)/login")}
        />
      </RNView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
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
