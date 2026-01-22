import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    height: 56,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: 8,
  },
});
