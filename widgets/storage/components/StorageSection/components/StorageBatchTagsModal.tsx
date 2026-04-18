import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import { Modal, TextInput, TouchableOpacity, View as RNView } from "react-native";
import { storageSectionStyles } from "../styles";

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <RNView style={storageSectionStyles.tagsModalOverlay}>
        <RNView style={storageSectionStyles.tagsModalBox}>
          <ThemedText style={storageSectionStyles.tagsModalTitle}>
            Теги для выбранных ({selectedCount})
          </ThemedText>
          <ThemedText style={storageSectionStyles.tagsModalHint}>
            Через запятую; этот набор заменит теги у каждого элемента
          </ThemedText>
          <TextInput
            style={storageSectionStyles.tagsModalInput}
            value={batchTagsInput}
            onChangeText={onChangeBatchTagsInput}
            placeholder="tag1, tag2"
            placeholderTextColor={Colors.secondary}
            multiline
          />
          <RNView style={storageSectionStyles.tagsModalButtons}>
            <TouchableOpacity onPress={onClose}>
              <ThemedText style={storageSectionStyles.batchDestinationCancel}>
                Отмена
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit}>
              <ThemedText style={storageSectionStyles.batchDestinationConfirm}>
                Сохранить
              </ThemedText>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </RNView>
    </Modal>
  );
}
