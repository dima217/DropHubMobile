import { useThemeColors } from "@/hooks/useThemeColors";
import TextInput from "@/shared/TextInput";
import Circle from "@/shared/ui/Circle";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface AddTagSectionProps {
  value: string;
  onChange: (v: string) => void;
  onAdd?: (tag: string) => void;
  existingTags: string[];
}

export const AddTagSection: React.FC<AddTagSectionProps> = ({
  value,
  onChange,
  onAdd,
  existingTags,
}) => {
  const colors = useThemeColors();

  const handleAdd = () => {
    const trimmed = value.trim();
    if (trimmed && !existingTags.includes(trimmed)) {
      onAdd?.(trimmed);
      onChange("");
    }
  };

  return (
    <View style={styles.addContainer}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Введите название тега"
        style={styles.input}
        right={
          <Circle onPress={handleAdd} size={40}>
            <Feather name="plus" size={20} color={colors.brightText} />
          </Circle>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  addContainer: {
    flexDirection: "row",
    gap: 12,
  },
  input: {
    flex: 1,
  },
});
