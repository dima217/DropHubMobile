import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { TagColorMap } from "@/store/slices/tagColorsSlice";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

interface ExistingTagsSelectorProps {
    availableTags: string[];
    tagColors: TagColorMap;
    onSelect?: (tag: string) => void;
  }
  
  export const ExistingTagsSelector: React.FC<ExistingTagsSelectorProps> = ({
    availableTags,
    tagColors,
    onSelect,
  }) => {
    if (!availableTags.length) return null;
  
    return (
      <View style={styles.existingTagsSection}>
        <ThemedText style={styles.existingTagsLabel}>
          Выбрать существующий:
        </ThemedText>
  
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.existingTagsScroll}
        >
          {availableTags.map((tag) => {
            const color = tagColors[tag];
  
            return (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.existingTagChip,
                  color && {
                    backgroundColor: `${color}20`,
                    borderColor: color,
                  },
                ]}
                onPress={() => onSelect?.(tag)}
              >
                <ThemedText
                  style={[
                    styles.existingTagChipText,
                    color && { color },
                  ]}
                >
                  #{tag}
                </ThemedText>
  
                <Feather
                  name="plus"
                  size={12}
                  color={color || Colors.secondary}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    existingTagsSection: {
      marginBottom: 16,
    },
    existingTagsLabel: {
      fontSize: 12,
      color: Colors.secondary,
      marginBottom: 8,
    },
    existingTagsScroll: {
      flexDirection: "row",
      gap: 8,
      paddingRight: 8,
    },
    existingTagChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      backgroundColor: `${Colors.secondary}20`,
      borderWidth: 1,
      borderColor: Colors.secondary,
      borderRadius: 16,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    existingTagChipText: {
      fontSize: 12,
      color: Colors.secondary,
      fontWeight: "600",
    },
  });
  