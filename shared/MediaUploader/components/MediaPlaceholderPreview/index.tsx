import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

interface MediaUploaderProps {
  type: "image" | "video";
}

const MediaPlaceholder = ({ type = "image" }: MediaUploaderProps) => {
  return (
    <View style={styles.placeholder}>
      <MaterialCommunityIcons
        name="image-plus"
        size={54}
        color="#d9d9d9"
        style={styles.icon}
      />

      <View style={styles.button}>
        <ThemedText type="small">
          {type === "image" ? "Add a Photo" : "Add a Video"}
        </ThemedText>
      </View>
    </View>
  );
};

export default MediaPlaceholder;

const styles = StyleSheet.create({
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 18,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 25,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  infoText: {
    color: "#d9d9d9",
    fontSize: 14,
  },
});
