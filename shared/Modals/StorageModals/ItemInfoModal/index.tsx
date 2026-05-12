import { StorageItem } from "@/api/types/storage";
import { useDebouncedStorageItemNote } from "@/hooks/useDebouncedStorageItemNote";
import { useThemeColors } from "@/hooks/useThemeColors";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ItemInfoModalProps {
  visible: boolean;
  item: StorageItem | null;
  onClose: () => void;
}

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const ItemInfoModal: React.FC<ItemInfoModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  const themeColors = useThemeColors();
  const { note, setNote, flush } = useDebouncedStorageItemNote(
    item?.id ?? null
  );

  const styles = useThemedStyles((c) => ({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "flex-end",
    },
    container: {
      backgroundColor: c.background,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
      padding: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "600",
      color: c.brightText,
    },
    closeButton: {
      padding: 4,
    },
    content: {
      maxHeight: 400,
    },
    infoRow: {
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      color: c.secondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: c.brightText,
    },
    valueSmall: {
      fontSize: 12,
      color: c.secondary,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 4,
    },
    tag: {
      backgroundColor: c.cardBackground,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      color: c.primary,
    },
    noTags: {
      fontSize: 14,
      color: c.secondary,
      fontStyle: "italic",
    },
    noteHint: {
      fontSize: 12,
      color: c.secondary,
      marginBottom: 8,
      lineHeight: 17,
    },
    noteInput: {
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 12,
      padding: 12,
      color: c.brightText,
      minHeight: 100,
      maxHeight: 160,
      textAlignVertical: "top",
      fontSize: 15,
      backgroundColor: c.cardBackground,
    },
  }));

  const handleClose = async () => {
    await flush();
    onClose();
  };

  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={() => void handleClose()}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>
              Информация {item.isDirectory ? "о папке" : "о файле"}
            </ThemedText>
            <TouchableOpacity onPress={() => void handleClose()} style={styles.closeButton}>
              <Feather name="x" size={24} color={themeColors.brightText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Название:</ThemedText>
              <ThemedText style={styles.value}>{item.name}</ThemedText>
            </View>

            {!item.isDirectory && item.fileMeta && (
              <>
                <View style={styles.infoRow}>
                  <ThemedText style={styles.label}>Размер:</ThemedText>
                  <ThemedText style={styles.value}>
                    {formatBytes(item.fileMeta.size)}
                  </ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <ThemedText style={styles.label}>Тип:</ThemedText>
                  <ThemedText style={styles.value}>
                    {item.fileMeta.mimeType}
                  </ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <ThemedText style={styles.label}>Загрузок:</ThemedText>
                  <ThemedText style={styles.value}>
                    {item.fileMeta.downloadCount}
                  </ThemedText>
                </View>
              </>
            )}

            {item.isDirectory && (
              <>
                <View style={styles.infoRow}>
                  <ThemedText style={styles.label}>Файлов:</ThemedText>
                  <ThemedText style={styles.value}>
                    {item.filesCount || 0}
                  </ThemedText>
                </View>
                <View style={styles.infoRow}>
                  <ThemedText style={styles.label}>Папок:</ThemedText>
                  <ThemedText style={styles.value}>
                    {item.foldersCount || 0}
                  </ThemedText>
                </View>
              </>
            )}

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Теги:</ThemedText>
              <View style={styles.tagsContainer}>
                {item.tags && item.tags.length > 0 ? (
                  item.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <ThemedText style={styles.tagText}>{tag}</ThemedText>
                    </View>
                  ))
                ) : (
                  <ThemedText style={styles.noTags}>Нет тегов</ThemedText>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>ID:</ThemedText>
              <ThemedText style={styles.valueSmall}>{item.id}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Мои заметки</ThemedText>
              <ThemedText style={styles.noteHint}>
                Только на этом устройстве, без синхронизации с сервером.
              </ThemedText>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Напишите заметку для себя…"
                placeholderTextColor={themeColors.secondary}
                multiline
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ItemInfoModal;
