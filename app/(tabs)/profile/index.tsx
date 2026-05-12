import { useThemedStyles } from "@/hooks/useThemedStyles";

import Header from "@/shared/Header";
import { useI18n } from "@/shared/localization";
import ProfileUpdateModal from "@/shared/Modals/ProfileUpdateModal";
import View from "@/shared/View";
import ProfileCard from "@/widgets/profile/components/ProfileCard";
import ProfileMenu from "@/widgets/profile/components/ProfileMenu";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, View as RNView, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const Profile = () => {
  const styles = useThemedStyles((c) => ({

  container: {
    backgroundColor: c.background,
  },
  content: {
    gap: 12,
  },

}));

  const { tl } = useI18n();
  const params = useLocalSearchParams();
  const showProfileUpdatedModal = params.showModal === 'profileUpdated';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View>
        <Header title={tl("My Profile")} onBackPress={() => Alert.alert(tl("Back"))} />
        <RNView style={styles.content}>
          <ProfileCard />
          <ProfileMenu />
        </RNView>
      </View>
      <ProfileUpdateModal
        isVisible={showProfileUpdatedModal}
        onClose={() => router.setParams({ showModal: undefined })}
      />
    </ScrollView>
  );
};

export default Profile;
