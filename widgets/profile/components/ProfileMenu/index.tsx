import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useProfileMenuItems } from "../../navigation";
import ProfileSection from "./ui/ProfileSection";

const ProfileMenu = () => {
  const router = useRouter();
  const { items: profileMenuItems, logoutModal } = useProfileMenuItems();

  return (
    <>
      <View style={styles.container}>
        {profileMenuItems.map((item, index) => (
          <ProfileSection
            key={item.id}
            icon={item.icon}
            title={item.title}
            onPress={() => {
              if (item.href) {
                router.push(item.href);
              } else item.onPress?.();
            }}
            isNested={item.isNested ?? false}
            isLast={index === profileMenuItems.length - 1}
          />
        ))}
      </View>
      {logoutModal}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
});

export default ProfileMenu;
