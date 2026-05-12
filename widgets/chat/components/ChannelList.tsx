import type { ChatChannel } from "@/api/types/chatChannels";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React from "react";
import {
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
  const s = useThemedStyles((c) => ({
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
      color: c.text,
      letterSpacing: 0.5,
    },
    addBtn: {
      width: 24,
      height: 24,
      borderRadius: 4,
      backgroundColor: c.cardBackground,
      alignItems: "center",
      justifyContent: "center",
    },
    addBtnText: { fontSize: 18, color: c.text, lineHeight: 20 },
    list: { flex: 1 },
    listContent: { paddingHorizontal: 8, paddingBottom: 8 },
    empty: {
      textAlign: "center",
      color: c.secondary,
      fontSize: 14,
      paddingVertical: 32,
    },
    emptyWrap: { alignItems: "center", paddingVertical: 32 },
    createLink: { color: c.primary, marginTop: 4 },
    channel: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 2,
    },
    channelActive: { backgroundColor: c.cardBackground },
    channelUnread: {},
    channelRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    channelName: { fontSize: 14, fontWeight: "500", color: c.text, flex: 1 },
    channelNameBold: { fontWeight: "bold", color: c.brightText },
    channelMeta: { flexDirection: "row", alignItems: "center", gap: 6 },
    unreadBadge: {
      backgroundColor: c.primary,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    unreadText: { fontSize: 10, fontWeight: "bold", color: c.brightText },
    memberCount: { fontSize: 10, color: c.secondary },
    preview: { fontSize: 12, color: c.secondary, marginTop: 2 },
    previewUnread: { color: c.text },
  }));

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
                style={[
                  s.channel,
                  isActive && s.channelActive,
                  unread > 0 && !isActive && s.channelUnread,
                ]}
                onPress={() => onSelect(ch.channel_id)}
                activeOpacity={0.7}
              >
                <View style={s.channelRow}>
                  <Text
                    style={[
                      s.channelName,
                      unread > 0 && !isActive && s.channelNameBold,
                    ]}
                    numberOfLines={1}
                  >
                    {ch.type === "direct" ? "@ " : "# "}
                    {ch.name || "Direct"}
                  </Text>
                  <View style={s.channelMeta}>
                    {unread > 0 && !isActive && (
                      <View style={s.unreadBadge}>
                        <Text style={s.unreadText}>
                          {unread > 99 ? "99+" : unread}
                        </Text>
                      </View>
                    )}
                    <Text style={s.memberCount}>{ch.member_count}</Text>
                  </View>
                </View>
                {ch.last_message_preview ? (
                  <Text
                    style={[
                      s.preview,
                      unread > 0 && !isActive && s.previewUnread,
                    ]}
                    numberOfLines={1}
                  >
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
