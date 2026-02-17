import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
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
              <Feather name="x" size={24} color={Colors.brightText} />
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
                const color = tagColors[tag] || Colors.secondary;
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
                          color={Colors.brightText}
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

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: Colors.background,
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
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.brightText,
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
    color: Colors.secondary,
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
    color: Colors.text,
  },
  labelActive: {
    color: Colors.brightText,
    fontWeight: "500",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
});
