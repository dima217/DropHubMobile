import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useAppTheme } from "@/providers/ThemeProvider";
import Button from "@/shared/Button";
import { ThemedText } from "@/shared/core/ThemedText";
import { useI18n } from "@/shared/localization";
import GoogleSignInButton from "@/shared/ui/GoogleSignInButton";
import RadialGradientBackground from "@/shared/ui/RadialGradientBackground";
import { useRouter } from "expo-router";
import { View as RNView } from "react-native";

export default function OnboardingScreen() {
  const router = useRouter();
  const { colorScheme } = useAppTheme();
  const { tl } = useI18n();

  const styles = useThemedStyles((c) => ({
    gradientContainer: {
      flex: 1,
    },
    transparentView: {
      backgroundColor: "transparent",
      overflow: "visible",
    },
    content: {
      position: "absolute",
      bottom: 50,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingTop: 32,
      gap: 32,
      alignItems: "center",
    },
    titleBlock: {
      gap: 16,
    },
    radialContainer: {
      height: "100%",
      width: "160%",
      position: "absolute",
      right: "-20%",
      top: 0,
      overflow: "visible",
    },
    moonWrapper: {
      position: "absolute",
      width: 400,
      height: 400,
      borderRadius: 200,
      right: 40,
      top: 80,
      overflow: "hidden",
    },
    moonContainer: {
      width: "100%",
      height: "100%",
    },
    buttonWrapper: {
      gap: 16,
      width: "100%",
    },
    skipButton: {
      backgroundColor: c.grey,
    },
    subtitle: {
      fontSize: 32,
      fontWeight: "600",
      lineHeight: 45,
    },
    title: {
      fontSize: 16,
      fontWeight: "500",
      lineHeight: 34,
    },
    description: {
      fontSize: 14,
      fontWeight: "400",
      lineHeight: 20,
      color: c.secondary,
    },
  }));

  return (
      <RNView style={{flex: 1}}>
        <RadialGradientBackground
          style={styles.radialContainer}
          opacities={colorScheme === "dark" ? [0.8, 0.0] : [1.0, 0.55, 0.0]}
        />
        <RNView style={styles.moonWrapper}>
          <RadialGradientBackground 
            style={styles.moonContainer} 
            colors={["#FFFFFF", "#FFFFFF"]}
            opacities={[0.9, 0.0]}
            offsets={[0, 100]}
            cx="80%"
            cy="30%"
            r="50%"
            fx="60%"
            fy="30%"
          />
        </RNView>
        <RNView style={styles.content}>
          <RNView style={styles.titleBlock}>
            <ThemedText style={styles.title}>
              {tl("WORK SPACE")}
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              {tl("Share Without Interference")}
            </ThemedText>
            <ThemedText style={styles.description}>
              {tl("DropHub is a workspace for your dreams. It is a place where you can share your ideas with others and get feedback on them.")}
            </ThemedText>
          </RNView>
          <RNView style={styles.buttonWrapper}>
            <GoogleSignInButton />
            <Button title={tl("Skip")} style={styles.skipButton} onPress={() => router.replace("/(auth)/login")} />
          </RNView>
        </RNView>
      </RNView>
  );
}
