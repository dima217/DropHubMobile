import BaseModal from "@/shared/Modals/BaseModal";
import { useI18n } from "@/shared/localization";
import React from "react";

interface ProfileUpdateModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { tl } = useI18n();

  return (
    <BaseModal
      isVisible={isVisible}
      title={tl("Profile updated")}
      message={tl("Profile updated successfully")}
      onClose={onClose}
      buttons={[
        {
          title: tl("Close"),
          onPress: onClose,
          variant: "primary",
        },
      ]}
    />
  );
};

export default ProfileUpdateModal;
