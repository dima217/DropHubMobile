import { Image } from 'expo-image';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from '../../styles';

interface ImagePreviewProps {
  uri: string;
  onOpenFull: () => void;
}

const ImagePreview = ({ uri, onOpenFull }: ImagePreviewProps) => {
  return (
    <TouchableOpacity
      style={styles.previewContainer}
      onPress={onOpenFull}
      activeOpacity={0.8}
    >
      <Image source={{ uri }} style={styles.previewImage} contentFit="cover" />
    </TouchableOpacity>
  );
};

export default ImagePreview;
