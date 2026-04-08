import { Colors } from "@/constants/design-tokens";
import TextInput from "@/shared/TextInput";
import React from "react";
import { ScrollView } from "react-native";
import { styles } from "../../styles";

type Props = {
  mode: "auth" | "anonymous";
  title: string;
  details: string;
  contactEmail: string;
  onTitle: (v: string) => void;
  onDetails: (v: string) => void;
  onContactEmail: (v: string) => void;
  disabled: boolean;
  scrollMaxHeight: number;
};

const CreateSupportTicketFormFields: React.FC<Props> = ({
  mode,
  title,
  details,
  contactEmail,
  onTitle,
  onDetails,
  onContactEmail,
  disabled,
  scrollMaxHeight,
}) => (
  <ScrollView
    style={[styles.scroll, { maxHeight: scrollMaxHeight }]}
    contentContainerStyle={styles.scrollContent}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >
    <TextInput
      label="Тема"
      value={title}
      onChangeText={onTitle}
      placeholder="Кратко, в чём суть"
      placeholderTextColor={Colors.secondary}
      editable={!disabled}
    />
    <TextInput
      label="Описание"
      value={details}
      onChangeText={onDetails}
      placeholder="Подробности"
      placeholderTextColor={Colors.secondary}
      multiline
      editable={!disabled}
    />
    {mode === "anonymous" ? (
      <TextInput
        label="Email для связи"
        value={contactEmail}
        onChangeText={onContactEmail}
        placeholder="you@example.com"
        placeholderTextColor={Colors.secondary}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!disabled}
      />
    ) : null}
  </ScrollView>
);

export default CreateSupportTicketFormFields;
