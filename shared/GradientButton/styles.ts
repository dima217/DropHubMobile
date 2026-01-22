import { StyleSheet } from "react-native";

import { Colors } from "@/constants/design-tokens";

const styles = StyleSheet.create({
  touchableContainer: {
    width: "90%",
    height: 56,
    borderRadius: 30,
    overflow: "hidden",
  },
  gradientContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  outline: {
    borderWidth: 1,
    borderColor: Colors.secondary,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
  },
});

export default styles;
