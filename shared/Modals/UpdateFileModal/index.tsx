import { Colors } from "@/constants/design-tokens";
import { ThemedText } from "@/shared/core/ThemedText";
import TextInput from "@/shared/TextInput";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";

type UpdateFileModalProps = {
  visible: boolean;
  fileId: string;
  storedName: string;
  onClose: () => void;
  onUpdate: (fileId: string, storedName: string) => void;
};

const UpdateFileModal: React.FC<UpdateFileModalProps> = ({
  visible,
  fileId,
  storedName,
  onClose,
  onUpdate,
}) => {
  const [singleFileName, setSingleFileName] = useState(
    storedName
  );

  useEffect(() => {
    setSingleFileName(storedName);
  }, [storedName, visible]);

  const handleUpload = () => {
    onUpdate(fileId, singleFileName.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ThemedText style={styles.title}>Update File</ThemedText>

          <View style={styles.singleFileContainer}>
              <ThemedText style={styles.label}>File Name:</ThemedText>
              <TextInput
                value={singleFileName}
                onChangeText={setSingleFileName}
                style={styles.input}
                placeholder="Enter file name"
              />
            </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonUpload} onPress={handleUpload}>
              <ThemedText style={styles.buttonText}>Update</ThemedText>
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
  },
  fileName: {
    fontSize: 14,
    flex: 1,
  },
  fileSize: {
    fontSize: 12,
    color: Colors.secondary,
    marginLeft: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 30,
  },
  buttonText: {
    color: Colors.brightText,
    fontWeight: "600",
  },
});

export default UpdateFileModal;
