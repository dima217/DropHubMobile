import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import AuthPrompt from "@/shared/ui/AuthPrompt";
import SignUpForm from "@/widgets/register/SignUpForm";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Icon from "../../assets/images/flash.svg";

const SignUp = () => {
  const router = useRouter();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon width={68} height={68} />
          <ThemedText>Sign Up</ThemedText>
        </View>
        <SignUpForm />
      </View>
      <View style={styles.innerContainer}>
        <AuthPrompt
          promptText="Already have an account?"
          actionText="Login"
          onPressAction={() => router.navigate("/(auth)/login")}
        />
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: 20,
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
