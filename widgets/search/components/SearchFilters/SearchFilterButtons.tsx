import { Friend } from "@/api/types/friend";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { MIME_TYPE_OPTIONS } from "./mimeTypes";

interface SearchFilterButtonsProps {
  selectedMimeTypes: string[];
  selectedTags: string[];
  selectedCreatorId: number | undefined;
  friends: Friend[];
  onPressType: () => void;
  onPressTag: () => void;
  onPressCreator: () => void;
}

function getTypeButtonLabel(selected: string[]): string {
  if (selected.length === 0) return "Type";
  const first = MIME_TYPE_OPTIONS.find((o) => o.value === selected[0]);
  const name = first ? first.label : selected[0];
  if (selected.length === 1) return name;
  return `${name} +${selected.length - 1}`;
}

function getTagButtonLabel(selected: string[]): string {
  if (selected.length === 0) return "Tag";
  const first = selected[0];
  if (selected.length === 1) return `#${first}`;
  return `#${first} +${selected.length - 1}`;
}

function getCreatorButtonLabel(
  selectedCreatorId: number | undefined,
  friends: Friend[]
): string {
  if (selectedCreatorId == null) return "Creator";
  const friend = friends.find((f) => f.friendProfile.id === selectedCreatorId);
  return friend?.friendProfile.firstName ?? "Creator";
}

export const SearchFilterButtons: React.FC<SearchFilterButtonsProps> = ({
  selectedMimeTypes,
  selectedTags,
  selectedCreatorId,
  friends,
  onPressType,
  onPressTag,
  onPressCreator,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        row: {
          flexDirection: "row",
          gap: 10,
          flexWrap: "wrap",
        },
        button: {
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingVertical: 10,
          paddingHorizontal: 14,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.cardBackground,
        },
        buttonActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        buttonText: {
          fontSize: 14,
          color: colors.text,
          maxWidth: 120,
        },
        buttonTextActive: {
          color: colors.brightText,
          fontWeight: "500",
        },
      }),
    [colors]
  );

  const hasType = selectedMimeTypes.length > 0;
  const hasTag = selectedTags.length > 0;
  const hasCreator = selectedCreatorId != null;

  const typeLabel = getTypeButtonLabel(selectedMimeTypes);
  const tagLabel = getTagButtonLabel(selectedTags);
  const creatorLabel = getCreatorButtonLabel(selectedCreatorId, friends);

  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={[styles.button, hasType && styles.buttonActive]}
        onPress={onPressType}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[styles.buttonText, hasType && styles.buttonTextActive]}
          numberOfLines={1}
        >
          {typeLabel}
        </ThemedText>
        <Feather
          name="chevron-down"
          size={16}
          color={hasType ? colors.brightText : colors.secondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, hasTag && styles.buttonActive]}
        onPress={onPressTag}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[styles.buttonText, hasTag && styles.buttonTextActive]}
          numberOfLines={1}
        >
          {tagLabel}
        </ThemedText>
        <Feather
          name="chevron-down"
          size={16}
          color={hasTag ? colors.brightText : colors.secondary}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, hasCreator && styles.buttonActive]}
        onPress={onPressCreator}
        activeOpacity={0.8}
      >
        <ThemedText
          style={[styles.buttonText, hasCreator && styles.buttonTextActive]}
          numberOfLines={1}
        >
          {creatorLabel}
        </ThemedText>
        <Feather
          name="chevron-down"
          size={16}
          color={hasCreator ? colors.brightText : colors.secondary}
        />
      </TouchableOpacity>
    </View>
  );
};
