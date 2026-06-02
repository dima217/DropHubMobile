import Settings from "@/assets/images/Setting.svg";
import SignOut from "@/assets/images/SignOut.svg";
import Support from "@/assets/images/Support.svg";
import { useThemeColors } from "@/hooks/useThemeColors";
import { syncFcmTokenToBackend } from "@/services/push/syncFcmTokenToBackend";
import { useI18n } from "@/shared/localization";
import LogoutConfirmationModal from "@/shared/Modals/LogoutConfirmationModal";
import { resetAppState } from "@/store/resetAppState";
import { Feather } from "@expo/vector-icons";
import { Href } from "expo-router";
import { ReactNode, useState } from "react";

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
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { secondary } = useThemeColors();
  const { tl } = useI18n();

  const handleLogoutClick = () => {
    console.log("Logout clicked");

    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutModal(false);
    try {
      await syncFcmTokenToBackend(null);
    } catch {
      /* токен на сервере мог не очиститься — всё равно выходим локально */
    }
    await resetAppState();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const items: MenuItem[] = [
    {
      id: "favorites",
      title: tl("Избранное"),
      icon: <Settings />, // TODO: Replace with Heart icon
      href: "/(tabs)/favorites",
      isNested: true,
    },
    {
      id: "trash",
      title: tl("Корзина"),
      icon: <Feather name="trash" size={24} color={secondary} />,
      href: "/(tabs)/trash",
      isNested: true,
    },
    {
      id: "notifications",
      title: tl("Notifications"),
      icon: <Feather name="bell" size={24} color={secondary} />,
      href: "/(tabs)/profile/notifications",
      isNested: true,
    },
    {
      id: "support",
      title: tl("Поддержка"),
      icon: <Support />,
      href: "/(tabs)/profile/support",
      isNested: true,
    },
    {
      id: "settings",
      title: tl("Account Settings"),
      icon: <Settings />,
      href: "/(tabs)/profile/settings",
      isNested: true,
    },
    {
      id: "logout",
      title: tl("Log Out"),
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
