import { useThemeColors } from "@/hooks/useThemeColors";
import { ThemedText } from "@/shared/core/ThemedText";
import React, { useMemo } from "react";
import {
  Modal,
  TextInput,
  TouchableOpacity,
  View as RNView,
} from "react-native";
import { createStorageSectionStyles } from "../styles";

type Props = {
  visible: boolean;
  selectedCount: number;
  batchTagsInput: string;
  onChangeBatchTagsInput: (t: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function StorageBatchTagsModal({
  visible,
  selectedCount,
  batchTagsInput,
  onChangeBatchTagsInput,
  onClose,
  onSubmit,
}: Props) {
  const themeColors = useThemeColors();
  const styles = useMemo(
    () => createStorageSectionStyles(themeColors),
    [themeColors]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <RNView style={styles.tagsModalOverlay}>
        <RNView style={styles.tagsModalBox}>
          <ThemedText style={styles.tagsModalTitle}>
            Теги для выбранных ({selectedCount})
          </ThemedText>
          <ThemedText style={styles.tagsModalHint}>
            Через запятую; этот набор заменит теги у каждого элемента
          </ThemedText>
          <TextInput
            style={styles.tagsModalInput}
            value={batchTagsInput}
            onChangeText={onChangeBatchTagsInput}
            placeholder="tag1, tag2"
            placeholderTextColor={themeColors.secondary}
            multiline
          />
          <RNView style={styles.tagsModalButtons}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={styles.batchDestinationCancel}>
                Отмена
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit}>
              <ThemedText style={styles.batchDestinationConfirm}>
                Сохранить
              </ThemedText>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </RNView>
    </Modal>
  );
}
