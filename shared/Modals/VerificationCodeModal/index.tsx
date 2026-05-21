import BaseModal from "@/shared/Modals/BaseModal";
import { useI18n } from "@/shared/localization";
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
  const { tl } = useI18n();
  return (
    <BaseModal
      isVisible={isVisible}
      title={tl("Код подтверждения отправлен")}
      message={`${tl("Код был отправлен на")} ${email}`}
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
