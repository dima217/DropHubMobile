import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface WelcomeModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ isVisible, onClose }) => {
  return (
    <BaseModal
      isVisible={isVisible}
      title="Добро пожаловать!"
      message="Рады видеть вас в приложении. Давайте начнём 🚀"
      onClose={onClose}
      buttons={[
        {
          title: "Закрыть",
          onPress: onClose,
          variant: "primary",
        },
      ]}
    />
  );
};

export default WelcomeModal;
