//import { useTranslation } from "@/hooks/useTranslation";
import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface LogoutConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const LogoutConfirmationModal: React.FC<LogoutConfirmationModalProps> = ({
  isVisible,
  onConfirm,
  onCancel,
}) => {
  //const { t } = useTranslation();

  return (
    <BaseModal
      isVisible={isVisible}
      title={"Выход из аккаунта"}
      message={"Вы уверены, что хотите выйти из аккаунта?"}
      onClose={onCancel}
      buttons={[
        {
          title: "Выйти",
          onPress: onConfirm,
          variant: "primary",
        },
        {
          title: "Отмена",
          onPress: onCancel,
          variant: "secondary",
        },
      ]}
    />
  );
};

export default LogoutConfirmationModal;
