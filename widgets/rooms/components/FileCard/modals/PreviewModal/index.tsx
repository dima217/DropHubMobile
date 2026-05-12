import { Feather } from '@expo/vector-icons';
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import ModalVideo from '../../ui/ModalVideo';
import createFileCardStyles from '../../styles';

interface PreviewModalProps {
  visible: boolean;
  onClose: () => void;
  isVideo: boolean;
  remoteMediaUri: string | null;
  imageUri: string | null;
}

const PreviewModal = ({
  visible,
  onClose,
  isVideo,
  remoteMediaUri,
  imageUri,
}: PreviewModalProps) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createFileCardStyles(colors), [colors]);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.fullPreviewOverlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        {visible &&
          (isVideo && remoteMediaUri ? (
            <ModalVideo key={remoteMediaUri} uri={remoteMediaUri} />
          ) : imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.fullPreviewImage}
              contentFit="contain"
            />
          ) : null)}
      </View>
    </Modal>
  );
};

export default PreviewModal;
