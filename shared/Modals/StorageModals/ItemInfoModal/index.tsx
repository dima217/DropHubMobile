import { StorageItem } from "@/api/types/storage";
import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";

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

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Не указано";
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const ItemInfoModal: React.FC<ItemInfoModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  if (!item) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <ThemedText style={styles.title}>
              Информация {item.isDirectory ? "о папке" : "о файле"}
            </ThemedText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color={Colors.brightText} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
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
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  container: {
    backgroundColor: Colors.background,
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
    color: Colors.brightText,
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
    color: Colors.secondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: Colors.brightText,
  },
  valueSmall: {
    fontSize: 12,
    color: Colors.secondary,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  tag: {
    backgroundColor: Colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: Colors.primary,
  },
  noTags: {
    fontSize: 14,
    color: Colors.secondary,
    fontStyle: "italic",
  },
});

export default ItemInfoModal;

