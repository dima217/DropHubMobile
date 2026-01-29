// components/ConnectionsList.tsx
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ConnectionCard from "../ConnectionCard";

export interface Connection {
  id: number;
  firstName: string;
  avatarUrl?: string;
}

interface ConnectionsListProps {
  data: Connection[];
  onPressItem: (item: Connection) => void;
}

const ConnectionsList = ({ data, onPressItem }: ConnectionsListProps) => {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      renderItem={({ item }) => (
        <ConnectionCard
          firstName={item.firstName}
          avatarUrl={item.avatarUrl}
          onPress={() => onPressItem(item)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 2,
    borderRadius: 14,
  },
});

export default ConnectionsList;
