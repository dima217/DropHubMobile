import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { styles } from "../../styles";

type Props = {
  isSubmitting: boolean;
  canSubmit: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const CreateSupportTicketModalFooter: React.FC<Props> = ({
  isSubmitting,
  canSubmit,
  onCancel,
  onSubmit,
}) => (
  <View style={styles.footer}>
    <TouchableOpacity
      style={[styles.footerBtn, styles.cancelBtn]}
      onPress={onCancel}
      disabled={isSubmitting}
    >
      <ThemedText style={styles.cancelText}>Отмена</ThemedText>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.footerBtn, styles.submitBtn]}
      onPress={onSubmit}
      disabled={!canSubmit || isSubmitting}
    >
      {isSubmitting ? (
        <ActivityIndicator color={Colors.brightText} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Feather
            name="send"
            size={18}
            color={Colors.brightText}
            style={{ marginRight: 8 }}
          />
          <ThemedText style={styles.submitText}>Отправить</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  </View>
);

export default CreateSupportTicketModalFooter;
