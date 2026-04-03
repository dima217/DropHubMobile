import { ThemedText } from '@/shared/core/ThemedText';
import React from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';

interface ProgressProps {
  progress: number;
}

const Progress = ({ progress }: ProgressProps) => {
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
