import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { TagColorMap } from "@/store/slices/tagColorsSlice";
import { FlatList, StyleSheet, View } from "react-native";
import { TagItem } from "../TagItem";

interface TagListProps {
    tags: string[];
    tagColors: TagColorMap;
    editingTag: string | null;
    onEditToggle: (tag: string | null) => void;
    onRemoveTag?: (tag: string) => void;
    onSelectColor: (tag: string, color: string) => void;
  }
  
  export const TagList: React.FC<TagListProps> = ({
    tags,
    tagColors,
    editingTag,
    onEditToggle,
    onRemoveTag,
    onSelectColor,
  }) => {
    return (
      <FlatList
        data={tags}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TagItem
            tag={item}
            color={tagColors[item]}
            isEditing={editingTag === item}
            onEditToggle={() =>
              onEditToggle(editingTag === item ? null : item)
            }
            onRemove={onRemoveTag}
            onSelectColor={onSelectColor}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              Нет тегов
            </ThemedText>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    );
  };
  
  const styles = StyleSheet.create({
    emptyContainer: {
      padding: 40,
      alignItems: "center",
    },
    emptyText: {
      color: Colors.secondary,
      fontSize: 14,
    },
    listContent: {
      paddingBottom: 20,
    },
  });
  