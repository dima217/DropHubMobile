import BaseModal from "@/shared/Modals/BaseModal";
import { useI18n } from "@/shared/localization";
import React from "react";

interface PasswordChangedModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const PasswordChangedModal: React.FC<PasswordChangedModalProps> = ({
  isVisible,
  onClose,
}) => {
  const { tl } = useI18n();
  return (
    <BaseModal
      isVisible={isVisible}
      title={tl("Пароль изменён")}
      message={tl("Ваш пароль был успешно обновлён. Теперь вы можете войти с новым паролем 🔐")}
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
