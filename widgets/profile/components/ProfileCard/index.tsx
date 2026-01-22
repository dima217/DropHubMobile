import { ThemedText } from "@/shared/core/ThemedText";
import { RootState } from "@/store/store";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Avatar from "./ui/Avatar";

const ProfileCard = () => {
  const profile = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={styles.container}>
      <Avatar title={profile?.firstName?.[0]?.toUpperCase()} />
      <ThemedText type="title" style={styles.name}>
        {profile?.firstName} {profile?.lastName}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.email}>
        {profile?.email}
      </ThemedText>
    </View>
  );
};

export default ProfileCard;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
    gap: 8,
  },
  name: {
    marginTop: 12,
  },
  email: {
    opacity: 0.7,
  },
});
