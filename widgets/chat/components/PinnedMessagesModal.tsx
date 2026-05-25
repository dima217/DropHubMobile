import type { ChatChannelMessage } from "@/api/types/chatChannels";
import { useThemeColors } from "@/hooks/useThemeColors";
import { Feather } from "@expo/vector-icons";
import React, { useMemo } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useResolveChatUserName } from "../lib/ChatUserNamesContext";

function formatTime(iso?: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString([], {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

interface Props {
  visible: boolean;
  onClose: () => void;
  messages: ChatChannelMessage[];
  /** Same as chat unpin: must send WS/API unpin for this message id. */
  onUnpin: (messageId: string) => void;
}

export function PinnedMessagesModal({
  visible,
  onClose,
  messages,
  onUnpin,
}: Props) {
  const resolveUserName = useResolveChatUserName();
  const colors = useThemeColors();
  const s = useMemo(
    () =>
      StyleSheet.create({
        backdrop: {
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.55)",
          justifyContent: "flex-end",
        },
        sheet: {
          maxHeight: "72%",
          backgroundColor: colors.background,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderWidth: 1,
          borderColor: colors.border,
          paddingBottom: 24,
        },
        header: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleRow: { flexDirection: "row", alignItems: "center" },
        title: {
          fontSize: 18,
          fontWeight: "600",
          color: colors.brightText,
        },
        titleSpaced: { marginLeft: 10, marginRight: 10 },
        countBadge: {
          minWidth: 24,
          height: 22,
          paddingHorizontal: 8,
          borderRadius: 11,
          backgroundColor: colors.cardBackground,
          alignItems: "center",
          justifyContent: "center",
        },
        countText: { fontSize: 12, fontWeight: "600", color: colors.primary },
        closeBtn: { padding: 4 },
        list: { padding: 16, paddingBottom: 24 },
        pinRow: {
          flexDirection: "row",
          alignItems: "stretch",
          backgroundColor: colors.cardBackground,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.border,
          overflow: "hidden",
        },
        unpinBtn: {
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 8,
          minWidth: 72,
        },
        unpinLabel: {
          fontSize: 11,
          fontWeight: "500",
          color: colors.reject,
          marginTop: 4,
        },
        pinAccent: {
          width: 4,
          backgroundColor: colors.primary,
        },
        pinBody: { flex: 1, padding: 12, gap: 4 },
        pinAuthor: {
          fontSize: 13,
          fontWeight: "600",
          color: colors.brightText,
        },
        pinContent: {
          fontSize: 14,
          color: colors.text,
          lineHeight: 20,
        },
        pinMeta: {
          fontSize: 11,
          color: colors.secondary,
          marginTop: 4,
        },
        empty: {
          padding: 40,
          alignItems: "center",
          gap: 12,
        },
        emptyText: {
          fontSize: 14,
          color: colors.secondary,
          textAlign: "center",
        },
      }),
    [colors]
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={s.backdrop} onPress={onClose}>
        <Pressable style={s.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={s.header}>
            <View style={s.headerTitleRow}>
              <Feather name="bookmark" size={20} color={colors.primary} />
              <Text style={[s.title, s.titleSpaced]}>Pinned</Text>
              <View style={s.countBadge}>
                <Text style={s.countText}>{messages.length}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={s.closeBtn}>
              <Feather name="x" size={22} color={colors.text} />
            </Pressable>
          </View>
          {messages.length === 0 ? (
            <View style={s.empty}>
              <Feather name="info" size={32} color={colors.secondary} />
              <Text style={s.emptyText}>No pinned messages in this chat</Text>
            </View>
          ) : (
            <FlatList
              data={messages}
              keyExtractor={(m) => m.message_id}
              contentContainerStyle={s.list}
              ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
              renderItem={({ item }) => (
                <View style={s.pinRow}>
                  <View style={s.pinAccent} />
                  <View style={s.pinBody}>
                    <Text style={s.pinAuthor}>
                      {resolveUserName(item.sender_id, item.sender_display_name)}
                    </Text>
                    <Text style={s.pinContent} numberOfLines={6}>
                      {item.deleted_at ? "(deleted)" : item.content}
                    </Text>
                    <Text style={s.pinMeta}>
                      {formatTime(item.pinned_at || item.created_at)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={s.unpinBtn}
                    onPress={() => onUnpin(item.message_id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel="Unpin message"
                  >
                    <Feather name="x-circle" size={20} color={colors.reject} />
                    <Text style={s.unpinLabel}>Unpin</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
