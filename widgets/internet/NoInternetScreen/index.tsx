import { Colors, Fonts } from "@/constants/design-tokens";
import { useNetwork } from "@/providers/NetworkProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

export function NoInternetScreen() {
  const { networkError, refresh } = useNetwork();

  const title =
    networkError === "airplane_mode"
      ? "Airplane Mode Enabled"
      : "No Internet Connection";

  const subtitle =
    networkError === "airplane_mode"
      ? "Disable airplane mode to reconnect"
      : "Check your connection and try again";

  return (
    <LinearGradient colors={Colors.gradient} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <Text style={styles.icon}>⚠️</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <Pressable style={styles.button} onPress={refresh}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: Colors.tab,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.inactive,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    color: Colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: Fonts.sans,
    color: Colors.secondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: Colors.text,
    fontSize: 15,
    fontFamily: Fonts.rounded,
  },
});
