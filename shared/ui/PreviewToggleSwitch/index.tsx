import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/shared/core/ThemedText';
import { Colors } from '@/constants/design-tokens';
import { Feather } from '@expo/vector-icons';

interface PreviewToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const PreviewToggleSwitch: React.FC<PreviewToggleSwitchProps> = ({
  isEnabled,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, isEnabled && styles.containerActive]}
      onPress={() => onToggle(!isEnabled)}
      activeOpacity={0.7}
    >
      <Feather
        name={isEnabled ? 'eye' : 'eye-off'}
        size={18}
        color={isEnabled ? Colors.primary : Colors.secondary}
      />
      <ThemedText style={[styles.label, isEnabled && styles.labelActive]}>
        Preview
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.inactive,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  containerActive: {
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 14,
    color: Colors.secondary,
  },
  labelActive: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default PreviewToggleSwitch;

