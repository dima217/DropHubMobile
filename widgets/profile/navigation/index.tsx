import Settings from "@/assets/images/Setting.svg";
import SignOut from "@/assets/images/SignOut.svg";
import Support from "@/assets/images/Support.svg";
import { secureStore } from "@/services/secureStore";
import LogoutConfirmationModal from "@/shared/Modals/LogoutConfirmationModal";
import { clearAuth } from "@/store/slices/authSlice";
import { Href } from "expo-router";
import { ReactNode, useState } from "react";
import { useDispatch } from "react-redux";

export interface MenuItem {
  id: string;
  title: string;
  icon: ReactNode;
  href?: Href;
  onPress?: () => void;
  isNested?: boolean;
}

export const useProfileMenuItems = (): {
  items: MenuItem[];
  logoutModal: ReactNode;
} => {
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    console.log("Logout clicked");

    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    try {
    } catch (error: any) {
      await secureStore.clearAll();
    }

    dispatch(clearAuth());
    await secureStore.clearAll();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const items: MenuItem[] = [
    {
      id: "support",
      title: "Support",
      icon: <Support />,
      href: "/(tabs)/profile/support",
      isNested: true,
    },
    {
      id: "settings",
      title: "Account Settings",
      icon: <Settings />,
      href: "/(tabs)/profile/settings",
      isNested: true,
    },
    {
      id: "logout",
      title: "Log Out",
      icon: <SignOut />,
      onPress: handleLogoutClick,
    },
  ];

  const logoutModal = (
    <LogoutConfirmationModal
      isVisible={showLogoutModal}
      onConfirm={handleLogoutConfirm}
      onCancel={handleLogoutCancel}
    />
  );

  return { items, logoutModal };
};
