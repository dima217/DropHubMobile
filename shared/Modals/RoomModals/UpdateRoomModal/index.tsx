import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from "@/shared/core/ThemedText";
import TextInput from "@/shared/TextInput";
import React, { useEffect, useState } from "react";
import {
    Modal,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

type UpdateRoomModalProps = {
  visible: boolean;
  roomId: string;
  owner: string;
  onClose: () => void;
  onUpdate: (roomId: string, owner: string) => void;
};

const UpdateRoomModal: React.FC<UpdateRoomModalProps> = ({
  visible,
  roomId,
  owner,
  onClose,
  onUpdate,
}) => {
  const styles = useThemedStyles((c) => ({

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  container: {
    backgroundColor: c.background,
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
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
    borderColor: c.border,
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  buttonCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: c.border,
    borderRadius: 30,
  },
  buttonUpdate: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: c.primary,
    borderRadius: 30,
  },
  buttonText: {
    color: c.brightText,
    fontWeight: "600",
  },

}));

  const [singleOwner, setSingleOwner] = useState(owner);

  useEffect(() => {
    setSingleOwner(owner);
  }, [owner, visible]);

  const handleUpdate = () => {
    onUpdate(roomId, singleOwner.trim());
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <ThemedText style={styles.title}>Update Room</ThemedText>

          <View style={styles.singleFileContainer}>
              <ThemedText style={styles.label}>Owner:</ThemedText>
              <TextInput
                value={singleOwner}
                onChangeText={setSingleOwner}
                style={styles.input}
                placeholder="Enter owner"
              />
            </View>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonUpdate} onPress={handleUpdate}>
              <ThemedText style={styles.buttonText}>Update Room</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdateRoomModal;
