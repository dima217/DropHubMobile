import { useThemeColors } from '@/hooks/useThemeColors';
import { ThemedText } from '@/shared/core/ThemedText';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import createFileCardStyles from '../../styles';

interface ProgressProps {
  progress: number;
}

const Progress = ({ progress }: ProgressProps) => {
  const colors = useThemeColors();
  const styles = useMemo(() => createFileCardStyles(colors), [colors]);
  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <ThemedText style={styles.progressText}>{Math.round(progress)}%</ThemedText>
    </View>
  );
};

export default Progress;
