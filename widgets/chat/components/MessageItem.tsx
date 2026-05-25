import type { ChatChannelMessage } from "@/api/types/chatChannels";
import { useThemeColors } from "@/hooks/useThemeColors";
import React, { useMemo, useState } from "react";
import { View, Text, TouchableOpacity, Pressable, StyleSheet } from "react-native";
import { useResolveChatUserName } from "../lib/ChatUserNamesContext";

interface Props {
  message: ChatChannelMessage;
  isOwn: boolean;
  showHeader: boolean;
  currentUserId: string;
  onReaction: (messageId: string, emoji: string) => void;
  onReply: (message: ChatChannelMessage) => void;
  onEdit: (messageId: string, content: string) => void;
  onDelete: (messageId: string) => void;
  onPin: (messageId: string) => void;
  readBy?: Set<string>;
  replyMsg?: ChatChannelMessage | null;
}

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "👀"];

export function MessageItem({
  message,
  isOwn,
  showHeader,
  currentUserId,
  onReaction,
  onReply,
  onEdit: _onEdit,
  onDelete,
  onPin,
  readBy,
  replyMsg,
}: Props) {
  const resolveUserName = useResolveChatUserName();
  const colors = useThemeColors();
  const st = useMemo(
    () =>
      StyleSheet.create({
        wrap: { marginTop: 2 },
        wrapHeader: { marginTop: 12 },
        systemWrap: { alignItems: "center", marginVertical: 8 },
        systemText: {
          fontSize: 12,
          color: colors.secondary,
          backgroundColor: colors.cardBackground,
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 16,
        },
        replyRow: {
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 32,
          marginBottom: 4,
          gap: 6,
          minHeight: 16,
        },
        replyCornerWrap: {
          width: 18,
          height: 14,
          justifyContent: "flex-end",
          alignItems: "flex-end",
          paddingRight: 2,
        },
        replyCorner: {
          width: 14,
          height: 12,
          borderLeftWidth: 2,
          borderTopWidth: 2,
          borderColor: colors.grey,
          borderTopLeftRadius: 4,
        },
        replyCtxText: { flex: 1, fontSize: 11, color: colors.secondary, minWidth: 0 },
        replyCtxName: { fontWeight: "600", color: colors.text },
        replySep: { color: colors.grey },
        replySnippet: { color: colors.secondary },
        header: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
        avatar: {
          width: 24,
          height: 24,
          borderRadius: 12,
          alignItems: "center",
          justifyContent: "center",
        },
        avatarOwn: { backgroundColor: colors.primary },
        avatarOther: { backgroundColor: colors.gradientPrimary },
        avatarText: { fontSize: 10, fontWeight: "bold", color: colors.brightText },
        sender: { fontSize: 14, fontWeight: "600" },
        senderOwn: { color: colors.primary },
        senderOther: { color: colors.gradientPrimary },
        time: { fontSize: 10, color: colors.grey },
        status: { fontSize: 10, color: colors.secondary, marginLeft: 4 },
        statusRead: { color: colors.gradientPrimary },
        pin: { fontSize: 10, color: "#FFD700" },
        body: { paddingLeft: 32 },
        content: { fontSize: 14, color: colors.text },
        deleted: { fontSize: 14, color: colors.secondary, fontStyle: "italic" },
        edited: { fontSize: 10, color: colors.secondary },
        reactions: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 4 },
        reaction: {
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          paddingHorizontal: 6,
          paddingVertical: 2,
          borderRadius: 12,
          backgroundColor: colors.cardBackground,
          borderWidth: 1,
          borderColor: colors.border,
        },
        reactionActive: { backgroundColor: colors.inactive, borderColor: colors.primary },
        reactionEmoji: { fontSize: 12 },
        reactionCount: { fontSize: 12, color: colors.text },
        actions: { flexDirection: "row", gap: 4, marginTop: 4 },
        actionBtn: {
          width: 24,
          height: 24,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.cardBackground,
          borderRadius: 4,
        },
        deleteText: { fontSize: 12 },
        reactionPicker: {
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 4,
          marginTop: 4,
          alignItems: "center",
        },
        reactionPickBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
        reactionPickEmoji: { fontSize: 18 },
        closePick: { color: colors.secondary, fontSize: 12, marginLeft: 8 },
      }),
    [colors]
  );

  function DeliveryStatus({
    status,
    readBy: readers,
  }: {
    status?: ChatChannelMessage["status"];
    readBy?: Set<string>;
  }) {
    if (!status) return null;
    const hasReaders = readers && readers.size > 0;
    if (status === "sending") return <Text style={st.status}>○</Text>;
    if (status === "sent" && !hasReaders) return <Text style={st.status}>✓</Text>;
    if (status === "read" || hasReaders)
      return <Text style={[st.status, st.statusRead]}>✓✓</Text>;
    return <Text style={st.status}>✓✓</Text>;
  }

  const [showActions, setShowActions] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const isDeleted = !!message.deleted_at;
  const isSystem = message.content_type === "system" || message.sender_type === "system";
  const reactions = message.reactions || {};
  const hasReactions = Object.keys(reactions).length > 0;
  const senderName =
    message.sender_type === "system"
      ? "System"
      : isOwn
        ? "You"
        : resolveUserName(message.sender_id, message.sender_display_name);

  if (isSystem) {
    return (
      <View style={st.systemWrap}>
        <Text style={st.systemText}>{message.content}</Text>
      </View>
    );
  }

  return (
    <Pressable
      style={[st.wrap, showHeader && st.wrapHeader]}
      onPress={() => setShowActions(!showActions)}
    >
      {replyMsg && !isDeleted && (
        <View style={st.replyRow}>
          <View style={st.replyCornerWrap}>
            <View style={st.replyCorner} />
          </View>
          <Text style={st.replyCtxText} numberOfLines={1}>
            <Text style={st.replyCtxName}>
              {resolveUserName(replyMsg.sender_id, replyMsg.sender_display_name)}
            </Text>
            <Text style={st.replySep}> · </Text>
            <Text style={st.replySnippet}>
              {replyMsg.deleted_at ? "(deleted)" : replyMsg.content.slice(0, 60)}
              {!replyMsg.deleted_at && replyMsg.content.length > 60 ? "…" : ""}
            </Text>
          </Text>
        </View>
      )}

      {showHeader && (
        <View style={st.header}>
          <View style={[st.avatar, isOwn ? st.avatarOwn : st.avatarOther]}>
            <Text style={st.avatarText}>{senderName.charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={[st.sender, isOwn ? st.senderOwn : st.senderOther]}>{senderName}</Text>
          <Text style={st.time}>{formatTime(message.created_at)}</Text>
          {isOwn && <DeliveryStatus status={message.status} readBy={readBy} />}
          {message.pinned_at && <Text style={st.pin}>📌</Text>}
        </View>
      )}

      <View style={st.body}>
        {isDeleted ? (
          <Text style={st.deleted}>Message deleted</Text>
        ) : (
          <>
            <Text style={st.content}>{message.content}</Text>
            {message.edited_at && <Text style={st.edited}> (edited)</Text>}
            {isOwn && !showHeader && <DeliveryStatus status={message.status} readBy={readBy} />}
            {!showHeader && message.pinned_at && <Text style={st.pin}> 📌</Text>}
          </>
        )}

        {hasReactions && !isDeleted && (
          <View style={st.reactions}>
            {Object.entries(reactions).map(([emoji, users]) => (
              <TouchableOpacity
                key={emoji}
                style={[st.reaction, users.includes(currentUserId) && st.reactionActive]}
                onPress={() => onReaction(message.message_id, emoji)}
              >
                <Text style={st.reactionEmoji}>{emoji}</Text>
                <Text style={st.reactionCount}>{users.length}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showActions && !isDeleted && (
          <View style={st.actions}>
            <TouchableOpacity
              style={st.actionBtn}
              onPress={() => setShowReactionPicker(!showReactionPicker)}
            >
              <Text>😊</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.actionBtn} onPress={() => onReply(message)}>
              <Text>↩</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.actionBtn} onPress={() => onPin(message.message_id)}>
              <Text>{message.pinned_at ? "📌" : "📍"}</Text>
            </TouchableOpacity>
            {isOwn && (
              <TouchableOpacity style={st.actionBtn} onPress={() => onDelete(message.message_id)}>
                <Text style={st.deleteText}>🗑</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {showReactionPicker && (
          <View style={st.reactionPicker}>
            {EMOJIS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={st.reactionPickBtn}
                onPress={() => {
                  onReaction(message.message_id, emoji);
                  setShowReactionPicker(false);
                }}
              >
                <Text style={st.reactionPickEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowReactionPicker(false)}>
              <Text style={st.closePick}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Pressable>
  );
}
