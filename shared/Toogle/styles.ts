import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: "stretch",
    height: 36,
    gap: 10,
  },
  button: {
    justifyContent: "center",
    padding: 10,
    paddingHorizontal: 18,
    alignItems: "center",
    borderRadius: 30,
  },
  text: {
    fontSize: 14,
    fontFamily: "Inter-SemiBold",
  },
});
