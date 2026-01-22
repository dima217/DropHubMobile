import { Colors } from "@/constants/design-tokens";
import { StyleSheet, View } from "react-native";

const Matches = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}></View>
    </View>
  );
};

export default Matches;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 10,
    paddingBottom: 0,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});
