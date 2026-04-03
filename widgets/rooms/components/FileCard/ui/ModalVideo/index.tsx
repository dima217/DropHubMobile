import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { styles } from '../../styles';

interface ModalVideoProps {
  uri: string;
}

const ModalVideo = ({ uri }: ModalVideoProps) => {
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
