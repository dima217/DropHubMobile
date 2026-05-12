import { Feather } from '@expo/vector-icons';
import { useThemeColors } from "@/hooks/useThemeColors";
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import createFileCardStyles from '../../styles';

interface InlineVideoProps {
  uri: string;
  posterUri: string | null;
  overlayPaused: boolean;
  onOpenFull: () => void;
}

const InlineVideo = ({
  uri,
  posterUri,
  overlayPaused,
  onOpenFull,
}: InlineVideoProps) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createFileCardStyles(colors), [colors]);
  const [showPoster, setShowPoster] = useState(!!posterUri);
  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.muted = true;
  });

  useEffect(() => {
    setShowPoster(!!posterUri);
  }, [uri, posterUri]);

  useEffect(() => {
    if (overlayPaused) player.pause();
    else player.play();
  }, [overlayPaused, player]);

  return (
    <View style={styles.previewContainer}>
      <VideoView
        player={player}
        style={styles.previewImage}
        contentFit="cover"
        nativeControls={false}
        onFirstFrameRender={() => setShowPoster(false)}
        {...(Platform.OS === 'android' ? { surfaceType: 'textureView' as const } : {})}
      />
      {showPoster && posterUri ? (
        <Image
          source={{ uri: posterUri }}
          style={[styles.previewImage, StyleSheet.absoluteFillObject]}
          contentFit="cover"
        />
      ) : null}
      <Pressable
        style={styles.previewTapOverlay}
        onPress={onOpenFull}
        android_ripple={{ color: 'rgba(255,255,255,0.12)' }}
      />
      <View style={styles.expandHint} pointerEvents="none">
        <Feather name="maximize-2" size={14} color="#FFFFFF" />
      </View>
    </View>
  );
};

export default InlineVideo;
