import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from '@/shared/core/ThemedText';
import Avatar from '@/widgets/profile/components/ProfileCard/ui/Avatar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface AuthorshipSectionProps {
  avatarUrl?: string;
  firstName?: string;
  userId?: number;
}

const AuthorshipSection: React.FC<AuthorshipSectionProps> = ({
  avatarUrl,
  firstName,
  userId,
}) => {
  const styles = useThemedStyles((c) => ({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    color: c.text,
    fontWeight: '500',
  },

}));

  if (!firstName && !userId) {
    return null;
  }

  const displayName = firstName || `User ${userId}`;
  const initial = firstName?.[0]?.toUpperCase() || '?';

  return (
    <View style={styles.container}>
      <Avatar
        size="small"
        uri={avatarUrl}
        title={initial}
      />
      <ThemedText style={styles.name} numberOfLines={1}>
        {displayName}
      </ThemedText>
    </View>
  );
};

export default AuthorshipSection;
