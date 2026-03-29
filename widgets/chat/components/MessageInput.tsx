import type { ChatChannelMessage } from "@/api/types/chatChannels";
import { Colors } from "@/constants/design-tokens";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserName } from "../lib/users";

const EMOJI_GROUPS: Record<string, string[]> = {
  Smileys: ["😀", "😂", "🥲", "😊", "😍", "🤔"],
  Gestures: ["👍", "👎", "👏", "🙌", "🤝", "✌️"],
  Hearts: ["❤️", "🧡", "💛", "💚", "💙", "💜"],
};

interface Props {
  onSend: (content: string, mentions?: string[]) => void;
  onTyping: (isTyping: boolean) => void;
  replyTo: ChatChannelMessage | null;
  onCancelReply: () => void;
}

export function MessageInput({ onSend, onTyping, replyTo, onCancelReply }: Props) {
  const [text, setText] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
    setShowEmoji(false);
    onTyping(false);
  };

  const handleChange = (value: string) => {
    setText(value);
    onTyping(!!value.trim());
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
  };

  return (
    <View style={s.wrap}>
      {replyTo && (
        <View style={s.replyBar}>
          <View style={s.replyIcon}>
            <Feather name="corner-up-left" size={14} color={Colors.primary} />
          </View>
          <View style={s.replyBody}>
            <Text style={s.replyLabel}>Reply to{" "}
              <Text style={s.replyName}>
                {replyTo.sender_display_name || getUserName(replyTo.sender_id)}
              </Text>
            </Text>
            <Text style={s.replyPreview} numberOfLines={2}>
              {replyTo.deleted_at ? "(deleted)" : replyTo.content}
            </Text>
          </View>
          <TouchableOpacity onPress={onCancelReply} style={s.cancelReply} hitSlop={8}>
            <Feather name="x" size={18} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      )}

      {showEmoji && (
        <View style={s.emojiPanel}>
          {Object.entries(EMOJI_GROUPS).map(([group, emojis]) => (
            <View key={group} style={s.emojiGroup}>
              <Text style={s.emojiGroupTitle}>{group}</Text>
              <View style={s.emojiRow}>
                {emojis.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={s.emojiBtn}
                    onPress={() => insertEmoji(emoji)}
                  >
                    <Text style={s.emoji}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={s.composer}>
        <View style={s.inputShell}>
          <TouchableOpacity
            style={[s.iconBtn, showEmoji && s.iconBtnActive]}
            onPress={() => setShowEmoji(!showEmoji)}
            activeOpacity={0.7}
          >
            <Feather
              name="smile"
              size={22}
              color={showEmoji ? Colors.primary : Colors.secondary}
            />
          </TouchableOpacity>

          <TextInput
            style={s.input}
            value={text}
            onChangeText={handleChange}
            placeholder={replyTo ? "Write a reply…" : "Message…"}
            placeholderTextColor={Colors.secondary}
            multiline
            maxLength={2000}
            textAlignVertical="center"
          />

          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim()}
            activeOpacity={0.85}
            style={[s.sendOuter, !text.trim() && s.sendOuterDisabled]}
          >
            <LinearGradient
              colors={
                text.trim()
                  ? [...Colors.buttonGradient]
                  : [Colors.grey, Colors.grey]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.sendGradient}
            >
              <Feather
                name="send"
                size={18}
                color={Colors.brightText}
                style={Platform.OS === "ios" ? { marginLeft: 2 } : undefined}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    paddingBottom: Platform.OS === "ios" ? 10 : 8,
    paddingTop: 10,
  },
  replyBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  replyIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(39, 136, 230, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  replyBody: { flex: 1, minWidth: 0 },
  replyLabel: { fontSize: 11, color: Colors.secondary, marginBottom: 2 },
  replyName: { fontWeight: "600", color: Colors.brightText },
  replyPreview: { fontSize: 13, color: Colors.text, lineHeight: 18 },
  cancelReply: { padding: 6 },
  emojiPanel: {
    maxHeight: 220,
    marginBottom: 10,
    padding: 12,
    backgroundColor: Colors.cardBackground,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emojiGroup: { marginBottom: 10 },
  emojiGroupTitle: {
    fontSize: 10,
    color: Colors.secondary,
    marginBottom: 6,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  emojiRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  emojiBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.listBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  emoji: { fontSize: 20 },
  composer: {},
  inputShell: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: Colors.cardBackground,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(35, 37, 64, 0.9)",
    paddingLeft: 6,
    paddingRight: 6,
    paddingVertical: 6,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBtnActive: {
    backgroundColor: "rgba(39, 136, 230, 0.12)",
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    fontSize: 16,
    lineHeight: 22,
    color: Colors.brightText,
  },
  sendOuter: {
    borderRadius: 22,
    overflow: "hidden",
  },
  sendOuterDisabled: {
    opacity: 0.85,
  },
  sendGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
