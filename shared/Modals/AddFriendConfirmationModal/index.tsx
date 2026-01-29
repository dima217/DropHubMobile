import BaseModal from "@/shared/Modals/BaseModal";
import React from "react";

interface AddFriendConfirmationModalProps {
  isVisible: boolean;
  userName?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const AddFriendConfirmationModal: React.FC<AddFriendConfirmationModalProps> = ({
  isVisible,
  userName,
  onConfirm,
  onCancel,
}) => {
  const displayName = userName || "этого пользователя";

  return (
    <BaseModal
      isVisible={isVisible}
      title="Добавить в друзья"
      message={`Хотите ли вы добавить ${displayName} в друзья?`}
      onClose={onCancel}
      buttons={[
        {
          title: "Добавить",
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

export default AddFriendConfirmationModal;

