import { Colors } from '@/constants/design-tokens';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import ModalVideo from '../../ui/ModalVideo';
import { styles } from '../../styles';

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
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.fullPreviewOverlay}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Feather name="x" size={24} color={Colors.brightText} />
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
