import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface VerificationCodeModalProps {
  isVisible: boolean;
  email: string;
  onClose: () => void;
}

const VerificationCodeModal: React.FC<VerificationCodeModalProps> = ({
  isVisible,
  email,
  onClose,
}) => {
  return (
    <BaseModal
      isVisible={isVisible}
      title="Код подтверждения отправлен"
      message={`Код был отправлен на ${email}`}
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

export default VerificationCodeModal;
