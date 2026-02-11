import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { TAG_PRESET_COLORS } from "../../constants/tags-colors";

interface TagItemProps {
    tag: string;
    color?: string;
    isEditing: boolean;
    onEditToggle: () => void;
    onRemove?: (tag: string) => void;
    onSelectColor: (tag: string, color: string) => void;
  }
  
export const TagItem: React.FC<TagItemProps> = ({
    tag,
    color,
    isEditing,
    onEditToggle,
    onRemove,
    onSelectColor,
  }) => {
    return (
      <View>
        <View
          style={[
            styles.tagItem,
            color && { borderLeftWidth: 4, borderLeftColor: color },
          ]}
        >
          {color && (
            <View
              style={[styles.tagColorDot, { backgroundColor: color }]}
            />
          )}
  
          <ThemedText style={styles.tagText}>
            #{tag}
          </ThemedText>
  
          <View style={styles.tagActions}>
            <TouchableOpacity onPress={onEditToggle}>
              <Feather
                name="droplet"
                size={16}
                color={color || Colors.secondary}
              />
            </TouchableOpacity>
  
            {onRemove && (
              <TouchableOpacity onPress={() => onRemove(tag)}>
                <Feather
                  name="x"
                  size={16}
                  color={Colors.reject}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
  
        {isEditing && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.colorPaletteContainer}
          >
            {TAG_PRESET_COLORS.map((preset) => (
              <TouchableOpacity
                key={preset}
                style={[
                  styles.colorSwatch,
                  { backgroundColor: preset },
                  color === preset && styles.colorSwatchSelected,
                ]}
                onPress={() => onSelectColor(tag, preset)}
              />
            ))}
          </ScrollView>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    tagItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: Colors.cardBackground,
      padding: 12,
      borderRadius: 8,
      marginBottom: 4,
    },
    tagColorDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginRight: 8,
    },
    tagText: {
      fontSize: 14,
      color: Colors.brightText,
      flex: 1,
    },
    tagActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    colorPaletteContainer: {
      flexDirection: "row",
      gap: 8,
      paddingVertical: 8,
      paddingHorizontal: 4,
      marginBottom: 8,
    },
    colorSwatch: {
      width: 32,
      height: 32,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: "transparent",
    },
    colorSwatchSelected: {
      borderColor: Colors.brightText,
      borderWidth: 3,
    },
  });
  