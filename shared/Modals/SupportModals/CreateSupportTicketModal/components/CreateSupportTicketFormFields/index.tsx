import TextInput from "@/shared/TextInput";
import { useThemeColors } from "@/hooks/useThemeColors";
import React, { useMemo } from "react";
import { ScrollView } from "react-native";
import { createSupportTicketModalStyles } from "../../styles";

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
}) => {
  const colors = useThemeColors();
  const styles = useMemo(
    () => createSupportTicketModalStyles(colors),
    [colors]
  );
  return (
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
      placeholderTextColor={colors.secondary}
      editable={!disabled}
    />
    <TextInput
      label="Описание"
      value={details}
      onChangeText={onDetails}
      placeholder="Подробности"
      placeholderTextColor={colors.secondary}
      multiline
      editable={!disabled}
    />
    {mode === "anonymous" ? (
      <TextInput
        label="Email для связи"
        value={contactEmail}
        onChangeText={onContactEmail}
        placeholder="you@example.com"
        placeholderTextColor={colors.secondary}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!disabled}
      />
    ) : null}
  </ScrollView>
);
}
export default CreateSupportTicketFormFields;
