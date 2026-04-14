import { useGetNotificationsQuery, useMarkNotificationsReadMutation } from "@/api";
import type { AppNotification } from "@/api/types/notification";
import { Colors } from "@/constants/design-tokens";
import { PushNotificationDataType } from "@/constants/pushNotifications";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { ThemedText } from "@/shared/core/ThemedText";
import { Href, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  View as RNView,
  StyleSheet,
} from "react-native";

const PAGE_SIZE = 20;

function navigateByNotification(router: ReturnType<typeof useRouter>, item: AppNotification) {
  const roomId = item.data.roomId;
  const resourceId = item.data.resourceId;

  if (item.type === PushNotificationDataType.ROOM_FILE && roomId) {
    router.push(`/(tabs)/rooms/${roomId}` as Href);
    return;
  }

  if (
    (item.type === PushNotificationDataType.SHARED_GRANT ||
      item.type === PushNotificationDataType.SHARED_UPLOAD) &&
    resourceId
  ) {
    router.push(`/(tabs)/shared` as Href);
    return;
  }

  router.push("/(tabs)/storage");
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<AppNotification[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, isLoading, isFetching, refetch } = useGetNotificationsQuery({
    limit: PAGE_SIZE,
    offset,
  });
  const [markRead, { isLoading: isMarkingRead }] = useMarkNotificationsReadMutation();

  useEffect(() => {
    if (!data) return;

    setItems((prev) => {
      if (offset === 0) return data;
      const existing = new Set(prev.map((n) => n.id));
      const next = [...prev];
      for (const n of data) {
        if (!existing.has(n.id)) next.push(n);
      }
      return next;
    });

    setHasMore(data.length === PAGE_SIZE);
  }, [data, offset]);

  const handleOpenNotification = async (item: AppNotification) => {
    const clearsOnTargetScreen =
      item.type === PushNotificationDataType.ROOM_FILE ||
      item.type === PushNotificationDataType.SHARED_GRANT ||
      item.type === PushNotificationDataType.SHARED_UPLOAD;

    if (!item.isRead && !clearsOnTargetScreen) {
      try {
        await markRead({ ids: [item.id] }).unwrap();
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
      } catch {
        // ignore
      }
    }

    navigateByNotification(router, item);
  };

  const handleEndReached = () => {
    if (isFetching || !hasMore) return;
    setOffset((prev) => prev + PAGE_SIZE);
  };

  return (
    <View>
      <Header title="Notifications" onBackPress={() => router.back()} />
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.2}
        contentContainerStyle={styles.listContent}
        refreshing={isFetching && offset === 0}
        onRefresh={() => {
          setOffset(0);
          setHasMore(true);
          void refetch();
        }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => void handleOpenNotification(item)}
            style={({ pressed }) => [
              styles.row,
              !item.isRead && styles.unreadRow,
              pressed && styles.pressed,
            ]}
          >
            <RNView style={styles.rowHeader}>
              <ThemedText style={styles.title}>{item.title}</ThemedText>
              {!item.isRead && <RNView style={styles.unreadDot} />}
            </RNView>
            <ThemedText style={styles.body}>{item.body}</ThemedText>
            <ThemedText style={styles.date}>
              {new Date(item.createdAt).toLocaleString()}
            </ThemedText>
          </Pressable>
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          ) : (
            <ThemedText style={styles.empty}>No notifications yet.</ThemedText>
          )
        }
        ListFooterComponent={
          isFetching && offset > 0 ? (
            <ActivityIndicator style={styles.loader} color={Colors.primary} />
          ) : isMarkingRead ? (
            <ThemedText style={styles.syncText}>Updating...</ThemedText>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 12,
    paddingBottom: 32,
    gap: 10,
  },
  row: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.cardBackground,
    padding: 12,
    gap: 6,
  },
  unreadRow: {
    borderColor: Colors.primary,
  },
  pressed: {
    opacity: 0.85,
  },
  rowHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  title: {
    color: Colors.brightText,
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  body: {
    color: Colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  date: {
    color: Colors.secondary,
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  empty: {
    color: Colors.secondary,
    textAlign: "center",
    paddingVertical: 24,
  },
  loader: {
    marginVertical: 20,
  },
  syncText: {
    color: Colors.secondary,
    textAlign: "center",
    paddingTop: 8,
  },
});
