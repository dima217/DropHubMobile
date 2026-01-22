import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 25,
    overflow: "hidden",
    alignSelf: "stretch",
    justifyContent: "space-between",
    height: 36,
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
