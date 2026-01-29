import Header from "@/shared/Header";
import View from "@/shared/View";
import EditProfileForm from "@/widgets/profile/components/EditProfileForm";
import { View as RNView, StyleSheet } from "react-native";

const ProfileEdit = () => {
  return (
    <View>
    <Header title="Edit Profile" />
        <RNView style={styles.content}>
          <EditProfileForm />
        </RNView>
    </View>
  );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 30,
    },
});

export default ProfileEdit;
