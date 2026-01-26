import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface ErrorModalProps {
  isVisible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({
  isVisible,
  title,
  message,
  onClose,
}) => {
  return (
    <BaseModal
      isVisible={isVisible}
      title={title || "Error"}
      message={message}
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

export default ErrorModal;
