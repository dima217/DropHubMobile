import { useThemeColors } from '@/hooks/useThemeColors';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import createFileCardStyles from '../../styles';

interface ImagePreviewProps {
  uri: string;
  onOpenFull: () => void;
}

const ImagePreview = ({ uri, onOpenFull }: ImagePreviewProps) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createFileCardStyles(colors), [colors]);
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
