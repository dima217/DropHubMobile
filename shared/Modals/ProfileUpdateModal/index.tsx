import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface ProfileUpdateModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const ProfileUpdateModal: React.FC<ProfileUpdateModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <BaseModal
      isVisible={isVisible}
      title="Profile updated"
      message="Profile updated successfully"
      onClose={onClose}
      buttons={[
        {
          title: "Close",
          onPress: onClose,
          variant: "primary",
        },
      ]}
    />
  );
};

export default ProfileUpdateModal;
