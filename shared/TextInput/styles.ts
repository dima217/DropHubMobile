import { Colors } from "@/constants/design-tokens";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "column",
    gap: 4,
    width: "90%",
  },
  inputContainer: {
    width: "100%",
    borderRadius: 29,
    height: 58,
    paddingHorizontal: 20,
    borderColor: Colors.border,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.inactive,
  },
  input: {
    width: "90%",
    color: Colors.text,
  },
  label: {
    fontSize: 12,
    color: Colors.border,
    paddingLeft: 15,
  },
  disabledInputContainer: {
    backgroundColor: Colors.inactive,
    borderBottomColor: Colors.inactive,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 15,
  },
  mainTextContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  labelContainer: {
    paddingHorizontal: 8,
  },
  leftContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorInputContainer: {
    borderBottomColor: Colors.reject,
  },
  errorContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  error: {
    fontSize: 10,
    color: Colors.reject,
  },
});

export default styles;
