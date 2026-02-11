import { useGetFriendsQuery } from "@/api/friendApi";
import { useGetStorageInfoQuery } from "@/api/storageApi";
import { SearchResourceType } from "@/api/types/search";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View as RNView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

interface SearchFiltersProps {
  selectedResourceType: SearchResourceType;
  onResourceTypeChange: (type: SearchResourceType) => void;
  selectedMimeType?: string;
  onMimeTypeChange: (type?: string) => void;
  selectedCreatorId?: number;
  onCreatorIdChange: (id?: number) => void;
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
  mimeTypes: string[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  selectedResourceType,
  onResourceTypeChange,
  selectedMimeType,
  onMimeTypeChange,
  selectedCreatorId,
  onCreatorIdChange,
  selectedTags,
  onTagToggle,
  mimeTypes,
}) => {
  const { data: friends } = useGetFriendsQuery();
  const { data: storageInfo } = useGetStorageInfoQuery();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filters}
    >
      <RNView style={styles.filterRow}>
        <ThemedText style={styles.filterLabel}>Тип ресурса:</ThemedText>
        {Object.values(SearchResourceType).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              selectedResourceType === type && styles.filterChipActive,
            ]}
            onPress={() => onResourceTypeChange(type)}
          >
            <ThemedText
              style={[
                styles.filterChipText,
                selectedResourceType === type && styles.filterChipTextActive,
              ]}
            >
              {type === SearchResourceType.ALL
                ? "Все"
                : type === SearchResourceType.ROOM
                ? "Комнаты"
                : "Хранилище"}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </RNView>

      {mimeTypes.length > 0 && (
        <RNView style={styles.filterRow}>
          <ThemedText style={styles.filterLabel}>Тип файла:</ThemedText>
          {mimeTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.filterChip,
                selectedMimeType === type && styles.filterChipActive,
              ]}
              onPress={() =>
                onMimeTypeChange(selectedMimeType === type ? undefined : type)
              }
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedMimeType === type && styles.filterChipTextActive,
                ]}
              >
                {type}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </RNView>
      )}

      {friends && friends.length > 0 && (
        <RNView style={styles.filterRow}>
          <ThemedText style={styles.filterLabel}>Друг:</ThemedText>
          {friends.map((friend) => (
            <TouchableOpacity
              key={friend.friendshipId}
              style={[
                styles.filterChip,
                selectedCreatorId === friend.friendProfile.id &&
                  styles.filterChipActive,
              ]}
              onPress={() =>
                onCreatorIdChange(
                  selectedCreatorId === friend.friendProfile.id
                    ? undefined
                    : friend.friendProfile.id
                )
              }
            >
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedCreatorId === friend.friendProfile.id &&
                    styles.filterChipTextActive,
                ]}
              >
                {friend.friendProfile.firstName}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </RNView>
      )}

      {storageInfo?.tags && storageInfo.tags.length > 0 && (
        <RNView style={styles.filterRow}>
          <ThemedText style={styles.filterLabel}>Теги:</ThemedText>
          {storageInfo.tags.map((tag) => (
            <TouchableOpacity
              key={tag}
              style={[
                styles.filterChip,
                selectedTags.includes(tag) && styles.filterChipActive,
              ]}
              onPress={() => onTagToggle(tag)}
            >
              <Feather
                name={selectedTags.includes(tag) ? "check" : "tag"}
                size={14}
                color={
                  selectedTags.includes(tag) ? Colors.brightText : Colors.primary
                }
              />
              <ThemedText
                style={[
                  styles.filterChipText,
                  selectedTags.includes(tag) && styles.filterChipTextActive,
                ]}
              >
                {tag}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </RNView>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  filters: {
    maxHeight: 200,
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  filterLabel: {
    fontSize: 14,
    color: Colors.secondary,
    marginRight: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.brightText,
  },
});

