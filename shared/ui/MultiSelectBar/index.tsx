import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from '@/shared/core/ThemedText';
import { ActionMenuItemData } from '@/shared/ui/ActionMenu/ActionMenuItem';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import ActionMenu from '../ActionMenu';

interface MultiSelectBarProps {
  selectedCount: number;
  menuItems?: ActionMenuItemData[];
}

const MultiSelectBar: React.FC<MultiSelectBarProps> = ({
  selectedCount,
  menuItems = [],
}) => {
  const styles = useThemedStyles((c) => ({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: c.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: c.border,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: c.primary,
  },

}));

  return (
    <View style={styles.container}>
      <ThemedText style={styles.countText}>
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </ThemedText>
      {menuItems.length > 0 && (
        <ActionMenu items={menuItems} />
      )}
    </View>
  );
};

export default MultiSelectBar;
