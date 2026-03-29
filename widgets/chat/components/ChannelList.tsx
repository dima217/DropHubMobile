import type { ChatChannel } from "@/api/types/chatChannels";
import { Colors } from "@/constants/design-tokens";
import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

interface Props {
  channels: ChatChannel[];
  activeChannelId: string | null;
  onSelect: (id: string) => void;
  onCreateNew: () => void;
  loading: boolean;
  unreadCounts?: Record<string, number>;
}

export function ChannelList({
  channels,
  activeChannelId,
  onSelect,
  onCreateNew,
  loading,
  unreadCounts = {},
}: Props) {
  return (
    <View style={s.container}>
      <View style={s.header}>
        <Text style={s.headerTitle}>Channels</Text>
        <TouchableOpacity style={s.addBtn} onPress={onCreateNew}>
          <Text style={s.addBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={s.list} contentContainerStyle={s.listContent}>
        {loading && channels.length === 0 ? (
          <Text style={s.empty}>Loading...</Text>
        ) : channels.length === 0 ? (
          <View style={s.emptyWrap}>
            <Text style={s.empty}>No channels yet</Text>
            <TouchableOpacity onPress={onCreateNew}>
              <Text style={s.createLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        ) : (
          channels.map((ch) => {
            const unread = unreadCounts[ch.channel_id] || 0;
            const isActive = ch.channel_id === activeChannelId;
            return (
              <TouchableOpacity
                key={ch.channel_id}
                style={[s.channel, isActive && s.channelActive, unread > 0 && !isActive && s.channelUnread]}
                onPress={() => onSelect(ch.channel_id)}
                activeOpacity={0.7}
              >
                <View style={s.channelRow}>
                  <Text
                    style={[s.channelName, unread > 0 && !isActive && s.channelNameBold]}
                    numberOfLines={1}
                  >
                    {ch.type === "direct" ? "@ " : "# "}
                    {ch.name || "Direct"}
                  </Text>
                  <View style={s.channelMeta}>
                    {unread > 0 && !isActive && (
                      <View style={s.unreadBadge}>
                        <Text style={s.unreadText}>{unread > 99 ? "99+" : unread}</Text>
                      </View>
                    )}
                    <Text style={s.memberCount}>{ch.member_count}</Text>
                  </View>
                </View>
                {ch.last_message_preview ? (
                  <Text style={[s.preview, unread > 0 && !isActive && s.previewUnread]} numberOfLines={1}>
                    {ch.last_message_preview}
                  </Text>
                ) : null}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  headerTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text,
    letterSpacing: 0.5,
  },
  addBtn: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: Colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { fontSize: 18, color: Colors.text, lineHeight: 20 },
  list: { flex: 1 },
  listContent: { paddingHorizontal: 8, paddingBottom: 8 },
  empty: { textAlign: "center", color: Colors.secondary, fontSize: 14, paddingVertical: 32 },
  emptyWrap: { alignItems: "center", paddingVertical: 32 },
  createLink: { color: Colors.primary, marginTop: 4 },
  channel: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 2,
  },
  channelActive: { backgroundColor: Colors.cardBackground },
  channelUnread: {},
  channelRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  channelName: { fontSize: 14, fontWeight: "500", color: Colors.text, flex: 1 },
  channelNameBold: { fontWeight: "bold", color: Colors.brightText },
  channelMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
  unreadBadge: {
    backgroundColor: Colors.primary,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  unreadText: { fontSize: 10, fontWeight: "bold", color: Colors.brightText },
  memberCount: { fontSize: 10, color: Colors.secondary },
  preview: { fontSize: 12, color: Colors.secondary, marginTop: 2 },
  previewUnread: { color: Colors.text },
});
