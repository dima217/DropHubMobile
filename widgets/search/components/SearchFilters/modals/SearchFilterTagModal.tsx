import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface SearchFilterTagModalProps {
  visible: boolean;
  tags: string[];
  tagColors: Record<string, string>;
  selectedTags: string[];
  onToggle: (tag: string) => void;
  onClose: () => void;
}

export const SearchFilterTagModal: React.FC<SearchFilterTagModalProps> = ({
  visible,
  tags,
  tagColors,
  selectedTags,
  onToggle,
  onClose,
}) => {
  const colors = useThemeColors();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        },
        sheet: {
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          paddingBottom: 32,
          maxHeight: "70%",
        },
        header: {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        title: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.brightText,
        },
        closeBtn: {
          padding: 4,
        },
        scroll: {
          maxHeight: 320,
        },
        scrollContent: {
          paddingTop: 8,
          paddingBottom: 16,
        },
        empty: {
          fontSize: 14,
          color: colors.secondary,
          paddingVertical: 24,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 12,
          gap: 12,
        },
        circle: {
          width: 12,
          height: 12,
          borderRadius: 6,
        },
        label: {
          flex: 1,
          fontSize: 16,
          color: colors.text,
        },
        labelActive: {
          color: colors.brightText,
          fontWeight: "500",
        },
        checkbox: {
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
        },
        checkboxChecked: {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
      }),
    [colors]
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>Теги</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={colors.brightText} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {tags.length === 0 ? (
              <ThemedText style={styles.empty}>Нет доступных тегов</ThemedText>
            ) : (
              tags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                const color = tagColors[tag] || colors.secondary;
                return (
                  <TouchableOpacity
                    key={tag}
                    style={styles.row}
                    onPress={() => onToggle(tag)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.circle,
                        { backgroundColor: color },
                      ]}
                    />
                    <ThemedText
                      style={[styles.label, isSelected && styles.labelActive]}
                      numberOfLines={1}
                    >
                      #{tag}
                    </ThemedText>
                    <View
                      style={[
                        styles.checkbox,
                        isSelected && styles.checkboxChecked,
                      ]}
                    >
                      {isSelected && (
                        <Feather
                          name="check"
                          size={14}
                          color="#FFFFFF"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
