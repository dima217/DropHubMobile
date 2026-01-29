import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { StyleSheet } from "react-native";

const Settings = () => {

  return (
    <View>
        <Header title="Settings" />
      <View style={styles.content}>
        <ThemedText type="small" style={styles.label}>
          Select Language
        </ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  label: {
    marginBottom: 20,
    color: Colors.text,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: Colors.inactive,
  },
  languageOptionActive: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderColor: Colors.primary,
  },
  languageText: {
    fontSize: 16,
    color: Colors.text,
  },
  languageTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  checkmark: {
    fontSize: 20,
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default Settings;
