import { useThemeColors } from '@/hooks/useThemeColors';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import createFileCardStyles from '../../styles';

interface ModalVideoProps {
  uri: string;
}

const ModalVideo = ({ uri }: ModalVideoProps) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createFileCardStyles(colors), [colors]);
  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
    p.muted = false;
  });

  useEffect(() => {
    player.play();
  }, [player]);

  return (
    <VideoView
      player={player}
      style={styles.fullPreviewImage}
      contentFit="contain"
      nativeControls
      {...(Platform.OS === 'android' ? { surfaceType: 'textureView' as const } : {})}
    />
  );
};

export default ModalVideo;
