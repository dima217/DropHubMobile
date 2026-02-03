import { Colors } from "@/constants/design-tokens";
import { UploadingFile } from "@/widgets/rooms/hooks/useRoomFileUpload";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type UploadPreviewModalProps = {
  visible: boolean;
  files: UploadingFile[];
  onClose: () => void;
  onUpload: (files: UploadingFile[]) => void;
};

const UploadPreviewModal: React.FC<UploadPreviewModalProps> = ({
  visible,
  files,
  onClose,
  onUpload,
}) => {
  const [singleFileName, setSingleFileName] = useState(
    files.length === 1 ? files[0].fileName : ""
  );

  const handleUpload = () => {
    if (files.length === 1) {
      onUpload([{ ...files[0], fileName: singleFileName }]);
    } else {
      onUpload(files);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Upload Preview</Text>

          {files.length > 1 ? (
            <FlatList
              data={files}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.fileRow}>
                  <Text style={styles.fileName}>{item.fileName}</Text>
                </View>
              )}
              style={styles.fileList}
            />
          ) : (
            <View style={styles.singleFileContainer}>
              <Text style={styles.label}>File Name:</Text>
              <TextInput
                value={singleFileName}
                onChangeText={setSingleFileName}
                style={styles.input}
                placeholder="Enter file name"
              />
            </View>
          )}

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleUpload}>
              <Text style={styles.buttonText}>Upload</Text>
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
  },
  fileName: {
    fontSize: 14,
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
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  buttonText: {
    color: Colors.brightText,
    fontWeight: "600",
  },
});

export default UploadPreviewModal;
