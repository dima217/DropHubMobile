import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface PasswordChangedModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PasswordChangedModal: React.FC<PasswordChangedModalProps> = ({
  isVisible,
  onClose,
}) => {
  return (
    <BaseModal
      isVisible={isVisible}
      title="Пароль изменён"
      message="Ваш пароль был успешно обновлён. Теперь вы можете войти с новым паролем 🔐"
      onClose={onClose}
      buttons={[
        {
          title: "Понятно",
          onPress: onClose,
          variant: "primary",
        },
      ]}
    />
  );
};

export default PasswordChangedModal;
