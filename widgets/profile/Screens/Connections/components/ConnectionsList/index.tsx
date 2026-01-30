// components/ConnectionsList.tsx
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ConnectionCard from "../ConnectionCard";
import FriendCard from "../FriendCard";
import FriendRequestCard from "../FriendRequestCard";

export interface Connection {
  id: number;
  firstName: string;
  avatarUrl?: string;
}

export interface FriendRequestItem extends Connection {
  requestId: number;
}

export interface FriendItem extends Connection {
  friendshipId: number;
}

export type ConnectionListType = "default" | "friendRequest" | "friend";

interface ConnectionsListProps {
  data: Connection[] | FriendRequestItem[] | FriendItem[];
  type?: ConnectionListType;
  onPressItem?: (item: Connection) => void;
  onAcceptRequest?: (item: FriendRequestItem) => void;
  onRejectRequest?: (item: FriendRequestItem) => void;
  onShareResource?: (item: FriendItem) => void;
  isLoading?: boolean;
}

const ConnectionsList = ({
  data,
  type = "default",
  onPressItem,
  onAcceptRequest,
  onRejectRequest,
  onShareResource,
  isLoading = false,
}: ConnectionsListProps) => {
  const renderItem = ({ item }: { item: Connection | FriendRequestItem | FriendItem }) => {
    switch (type) {
      case "friendRequest":
        const requestItem = item as FriendRequestItem;
        return (
          <FriendRequestCard
            firstName={requestItem.firstName}
            avatarUrl={requestItem.avatarUrl}
            onPress={() => onPressItem?.(requestItem)}
            onAccept={() => onAcceptRequest?.(requestItem)}
            onReject={() => onRejectRequest?.(requestItem)}
            isLoading={isLoading}
          />
        );
      case "friend":
        const friendItem = item as FriendItem;
        return (
          <FriendCard
            firstName={friendItem.firstName}
            avatarUrl={friendItem.avatarUrl}
            onPress={() => onPressItem?.(friendItem)}
            onShareResource={() => onShareResource?.(friendItem)}
          />
        );
      default:
        return (
          <ConnectionCard
            firstName={item.firstName}
            avatarUrl={item.avatarUrl}
            onPress={() => onPressItem?.(item)}
          />
        );
    }
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.container}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      renderItem={renderItem}
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
