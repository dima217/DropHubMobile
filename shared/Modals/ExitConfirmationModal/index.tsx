import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface ExitConfirmationModalProps {
  isVisible: boolean;
  onConfirmExit: () => void;
  onCancel: () => void;
}

const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({
  isVisible,
  onConfirmExit,
  onCancel,
}) => {
  return (
    <BaseModal
      isVisible={isVisible}
      title="Внимание"
      message="Вы уверены, что хотите выйти?"
      onClose={onCancel}
      buttons={[
        {
          title: "Выйти",
          onPress: onConfirmExit,
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

export default ExitConfirmationModal;
