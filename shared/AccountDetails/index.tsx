import Bell from "@/assets/images/Bell.svg";
import { useGetNotificationsQuery } from "@/api";
import { RootState } from "@/store/store";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { ThemedText } from "../core/ThemedText";
import Circle from "../ui/Circle";

const AccountDetails = () => {
  const profile = useSelector((state: RootState) => state.auth.user);
  const router = useRouter();
  const { data: notifications } = useGetNotificationsQuery({ limit: 100, offset: 0 });
  const hasUnreadNotifications =
    notifications?.some((notification) => !notification.isRead) ?? false;

  const getInitials = () => {
    if (!profile) return "?";
    const firstName = profile.firstName || "";
    if (firstName) return firstName[0].toUpperCase();
    if (profile.email) return profile.email[0].toUpperCase();
    return "?";
  };

  const getFirstName = () => {
    if (!profile) return "";
    return profile.firstName || profile.email || "";
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Avatar 
          size={50} 
          title={getInitials()} 
          uri={`${profile?.avatarUrl}?t=${Date.now()}`} 
          key={profile?.avatarUrl} 
          onPress={() => router.push("/(tabs)/profile")}
        />
        <View style={styles.infoContainer}>
          <ThemedText type="subtitle">{getFirstName()}</ThemedText>
          <ThemedText type="small">{profile?.email || ""}</ThemedText>
        </View>
      </View>
      <View style={styles.bellWrapper}>
        <Circle
          size={50}
          onPress={() => {
            router.push("/(tabs)/profile/notifications");
          }}
        >
          <Bell />
        </Circle>
        {hasUnreadNotifications ? <View style={styles.unreadBadge} /> : null}
      </View>
    </View>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "stretch",
    justifyContent: "space-between",
    alignItems: "center",
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  infoContainer: {
    flexDirection: "column",
    gap: 5,
  },
  bellWrapper: {
    position: "relative",
  },
  unreadBadge: {
    position: "absolute",
    top: 3,
    right: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF4A75",
    borderWidth: 1,
    borderColor: "#060D18",
  },
});
