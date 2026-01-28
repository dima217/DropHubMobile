import { ThemedText } from "@/shared/core/ThemedText";
import Circle from "@/shared/ui/Circle";
import { RootState } from "@/store/store";
import { Image, StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import Avatar from "./ui/Avatar";

const ProfileCard = () => {
  const profile = useSelector((state: RootState) => state.auth.user);

  return (
    <View style={styles.container}>
      <Avatar title={profile?.firstName?.[0]?.toUpperCase()} />
      <ThemedText type="title" style={styles.name}>
        {profile?.firstName}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.email}>
        {profile?.email}
      </ThemedText>
      <Circle>
        <Image source={{ uri: profile?.avatarUrl }} style={styles.iconImage} />
      </Circle>
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
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
