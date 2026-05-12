import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/shared/core/ThemedText';
import { useI18n } from '@/shared/localization';
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { Feather } from '@expo/vector-icons';

interface PreviewToggleSwitchProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const PreviewToggleSwitch: React.FC<PreviewToggleSwitchProps> = ({
  isEnabled,
  onToggle,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: c.inactive,
    borderWidth: 1,
    borderColor: c.border,
  },
  containerActive: {
    backgroundColor: c.cardBackground,
    borderColor: c.primary,
  },
  label: {
    fontSize: 14,
    color: c.secondary,
  },
  labelActive: {
    color: c.primary,
    fontWeight: '600',
  },

}));

  const { tl } = useI18n();
  return (
    <TouchableOpacity
      style={[styles.container, isEnabled && styles.containerActive]}
      onPress={() => onToggle(!isEnabled)}
      activeOpacity={0.7}
    >
      <Feather
        name={isEnabled ? 'eye' : 'eye-off'}
        size={18}
        color={isEnabled ? themeColors.primary : themeColors.secondary}
      />
      <ThemedText style={[styles.label, isEnabled && styles.labelActive]}>
        {tl('Preview')}
      </ThemedText>
    </TouchableOpacity>
  );
};

export default PreviewToggleSwitch;
