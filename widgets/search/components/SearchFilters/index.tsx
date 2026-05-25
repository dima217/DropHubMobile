import { useGetFriendsQuery } from "@/api/friendApi";
import { useGetStorageInfoQuery } from "@/api/storageApi";
import { SearchResourceType } from "@/api/types/search";
import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { useI18n } from "@/shared/localization";
import { RootState } from "@/store/store";
import { Feather } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  View as RNView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { SearchFilterButtons } from "./SearchFilterButtons";
import { SearchFilterCreatorModal } from "./modals/SearchFilterCreatorModal";
import { SearchFilterTagModal } from "./modals/SearchFilterTagModal";
import { SearchFilterTypeModal } from "./modals/SearchFilterTypeModal";

export interface SearchFiltersProps {
  selectedResourceType: SearchResourceType;
  onResourceTypeChange: (type: SearchResourceType) => void;
  selectedMimeTypes: string[];
  onMimeTypesChange: (types: string[]) => void;
  selectedCreatorId: number | undefined;
  onCreatorIdChange: (id: number | undefined) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedResourceType,
  onResourceTypeChange,
  selectedMimeTypes,
  onMimeTypesChange,
  selectedCreatorId,
  onCreatorIdChange,
  selectedTags,
  onTagToggle,
}) => {
  const { tl } = useI18n();
  const [typeModalVisible, setTypeModalVisible] = useState(false);
  const [tagModalVisible, setTagModalVisible] = useState(false);
  const [creatorModalVisible, setCreatorModalVisible] = useState(false);

  const { data: friends = [] } = useGetFriendsQuery();
  const { data: storageInfo } = useGetStorageInfoQuery();
  const tagColors = useSelector(
    (state: RootState) => (state.tagColors as { colors: Record<string, string> }).colors ?? {}
  );

  const tags = storageInfo?.tags ?? [];
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        wrapper: {
          gap: 12,
        },
        resourceRow: {
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
        },
        resourceLabel: {
          fontSize: 14,
          color: colors.secondary,
        },
        resourceChips: {
          flexDirection: "row",
          gap: 8,
        },
        chip: {
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.cardBackground,
        },
        chipActive: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
        chipText: {
          fontSize: 12,
          color: colors.text,
        },
        chipTextActive: {
          color: colors.brightText,
          fontWeight: "500",
        },
      }),
    [colors]
  );

  return (
    <RNView style={styles.wrapper}>
      <RNView style={styles.resourceRow}>
        <ThemedText style={styles.resourceLabel}>{tl("Ресурс:")}</ThemedText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.resourceChips}
        >
          {[
            { value: SearchResourceType.ALL, label: tl("Все") },
            { value: SearchResourceType.ROOM, label: tl("Rooms") },
            { value: SearchResourceType.STORAGE, label: tl("Storage") },
          ].map(({ value, label }) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.chip,
                selectedResourceType === value && styles.chipActive,
              ]}
              onPress={() => onResourceTypeChange(value)}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  selectedResourceType === value && styles.chipTextActive,
                ]}
              >
                {label}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </RNView>

      <SearchFilterButtons
        selectedMimeTypes={selectedMimeTypes}
        selectedTags={selectedTags}
        selectedCreatorId={selectedCreatorId}
        friends={friends}
        onPressType={() => setTypeModalVisible(true)}
        onPressTag={() => setTagModalVisible(true)}
        onPressCreator={() => setCreatorModalVisible(true)}
      />

      <SearchFilterTypeModal
        visible={typeModalVisible}
        selectedMimeTypes={selectedMimeTypes}
        onSelect={onMimeTypesChange}
        onClose={() => setTypeModalVisible(false)}
      />

      <SearchFilterTagModal
        visible={tagModalVisible}
        tags={tags}
        tagColors={tagColors}
        selectedTags={selectedTags}
        onToggle={onTagToggle}
        onClose={() => setTagModalVisible(false)}
      />

      <SearchFilterCreatorModal
        visible={creatorModalVisible}
        selectedCreatorId={selectedCreatorId}
        onSelect={onCreatorIdChange}
        onClose={() => setCreatorModalVisible(false)}
      />
    </RNView>
  );
};
