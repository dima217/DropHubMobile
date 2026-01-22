import { Colors } from "@/constants/design-tokens";
import Button from "@/shared/Button";
import { clearAuth } from "@/store/slices/authSlice";
import ProfileCard from "@/widgets/profile/components/ProfileCard";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

const Profile = () => {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.content}>
        <ProfileCard />
      </View>

      <View style={styles.footer}>
        <Button title="Logout" onPress={() => dispatch(clearAuth())} />
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    padding: 10,
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    alignItems: "center",
    padding: 16,
    paddingHorizontal: 0,
  },
});
