import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import { useI18n } from "@/shared/localization";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MIME_TYPE_OPTIONS } from "../mimeTypes";

interface SearchFilterTypeModalProps {
  visible: boolean;
  selectedMimeTypes: string[];
  onSelect: (values: string[]) => void;
  onClose: () => void;
}

export const SearchFilterTypeModal: React.FC<SearchFilterTypeModalProps> = ({
  visible,
  selectedMimeTypes,
  onSelect,
  onClose,
}) => {
  const { tl } = useI18n();
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
        list: {
          paddingTop: 8,
        },
        row: {
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 14,
          gap: 12,
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

  const selectedSet = useMemo(
    () => new Set(selectedMimeTypes),
    [selectedMimeTypes]
  );

  const toggle = (value: string) => {
    const next = selectedSet.has(value)
      ? selectedMimeTypes.filter((v) => v !== value)
      : [...selectedMimeTypes, value];
    onSelect(next);
  };

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
            <ThemedText style={styles.title}>{tl("Тип файла")}</ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={24} color={colors.brightText} />
            </TouchableOpacity>
          </View>
          <View style={styles.list}>
            {MIME_TYPE_OPTIONS.map((opt) => {
              const isChecked = selectedSet.has(opt.value);
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={styles.row}
                  onPress={() => toggle(opt.value)}
                  activeOpacity={0.7}
                >
                  <Feather
                    name={opt.icon as keyof typeof Feather.glyphMap}
                    size={22}
                    color={isChecked ? colors.primary : colors.secondary}
                  />
                  <ThemedText
                    style={[styles.label, isChecked && styles.labelActive]}
                    numberOfLines={1}
                  >
                    {tl(opt.label)}
                  </ThemedText>
                  <View
                    style={[
                      styles.checkbox,
                      isChecked && styles.checkboxChecked,
                    ]}
                  >
                    {isChecked && (
                      <Feather
                        name="check"
                        size={14}
                        color="#FFFFFF"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
