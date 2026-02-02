import { Colors } from '@/constants/design-tokens';
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  countText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});

export default MultiSelectBar;

