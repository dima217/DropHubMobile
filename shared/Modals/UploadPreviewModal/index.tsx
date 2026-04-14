import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import type { PendingUploadFile } from "@/shared/types/pendingUpload";
import TextInput from "@/shared/TextInput";
import { StorageQuotaBar } from "@/widgets/storage/components/StorageQuotaBar";
import {
  formatBytes,
  storageFreeBytes,
} from "@/widgets/storage/utils/storageQuota";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

/** Алиас для превью загрузки (комната / хранилище / shared). */
export type UploadPreviewFile = PendingUploadFile;

type UploadPreviewModalProps = {
  visible: boolean;
  files: PendingUploadFile[];
  onClose: () => void;
  /** Возвращает `false` при ошибке; при `true` или `void` модалка закроется после успеха. */
  onUpload: (files: PendingUploadFile[]) => Promise<boolean | void>;
  /** Квота основного хранилища (GET /storage) — полоска до init upload. */
  quota?: { usedBytes: number; maxBytes: number } | null;
};

const UploadPreviewModal: React.FC<UploadPreviewModalProps> = ({
  visible,
  files,
  onClose,
  onUpload,
  quota,
}) => {
  const [singleFileName, setSingleFileName] = useState(
    files.length === 1 ? files[0].fileName : ""
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (files.length === 1) setSingleFileName(files[0].fileName);
  }, [files, visible]);

  const handleUpload = async () => {
    const filesToUpload =
      files.length === 1
        ? [
            {
              ...files[0],
              fileName: singleFileName.trim() || files[0].fileName,
            },
          ]
        : files;

    const totalBytes = filesToUpload.reduce((s, f) => s + f.fileSize, 0);
    if (quota && quota.maxBytes > 0) {
      const free = storageFreeBytes(quota.maxBytes, quota.usedBytes);
      if (totalBytes > free) {
        Alert.alert(
          "Недостаточно места",
          `Выбранные файлы (${formatBytes(
            totalBytes
          )}) не помещаются в свободное место (${formatBytes(
            free
          )}). Удалите часть файлов или освободите место в хранилище.`
        );
        return;
      }
    }

    setSubmitting(true);
    try {
      const result = await onUpload(filesToUpload);
      if (result !== false) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ThemedText style={styles.title}>Upload Preview</ThemedText>

          {quota && quota.maxBytes > 0 ? (
            <StorageQuotaBar usedBytes={quota.usedBytes} maxBytes={quota.maxBytes} />
          ) : null}

          {files.length > 1 ? (
            <FlatList
              data={files}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.fileRow}>
                  <ThemedText style={styles.fileName}>{item.fileName}</ThemedText>
                  <ThemedText style={styles.fileSize}>
                    {formatBytes(item.fileSize)}
                  </ThemedText>
                </View>
              )}
              style={styles.fileList}
            />
          ) : (
            <View style={styles.singleFileContainer}>
              <ThemedText style={styles.label}>File Name:</ThemedText>
              <TextInput
                value={singleFileName}
                onChangeText={setSingleFileName}
                style={styles.input}
                placeholder="Enter file name"
              />
              {files[0] ? (
                <ThemedText style={styles.fileSizeSingle}>
                  {formatBytes(files[0].fileSize)}
                </ThemedText>
              ) : null}
            </View>
          )}

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.buttonCancel}
              onPress={onClose}
              disabled={submitting}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonUpload, submitting && styles.buttonDisabled]}
              onPress={() => void handleUpload()}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={Colors.brightText} />
              ) : (
                <ThemedText style={styles.buttonText}>Upload</ThemedText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  fileList: {
    marginBottom: 16,
  },
  fileRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  fileName: {
    fontSize: 14,
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.secondary,
  },
  singleFileContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  fileSizeSingle: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 4,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  buttonCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.border,
    borderRadius: 30,
  },
  buttonUpload: {
    minWidth: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.brightText,
    fontWeight: "600",
  },
});

export default UploadPreviewModal;
