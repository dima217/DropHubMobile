
import { Colors } from "@/constants/design-tokens";
import Header from "@/shared/Header";
import View from "@/shared/View";
import ProfileCard from "@/widgets/profile/components/ProfileCard";
import ProfileMenu from "@/widgets/profile/components/ProfileMenu";
import { View as RNView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Header title="My Profile" />
        <RNView style={styles.content}>
          <ProfileCard />
          <ProfileMenu />
        </RNView>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  content: {
    gap: 12,
  },
});
