import { useGetRoomDetailsQuery } from "@/api/roomApi";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { useAutoMarkRoomFileNotificationsRead } from "@/hooks/data/useAutoMarkNotificationsOnView";
import { getUserIdFromAccessToken } from "@/services/auth/getUserIdFromAccessToken";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { RootState } from "@/store/store";
import { MessageInput } from "@/widgets/chat/components/MessageInput";
import { MessageList } from "@/widgets/chat/components/MessageList";
import { PinnedMessagesModal } from "@/widgets/chat/components/PinnedMessagesModal";
import { useChatUserNamesMap } from "@/widgets/chat/hooks/useChatUserNamesMap";
import { useChat } from "@/widgets/chat/hooks/useChat";
import { useWebSocket } from "@/widgets/chat/hooks/useWebSocket";
import { ChatUserNamesProvider } from "@/widgets/chat/lib/ChatUserNamesContext";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import { useSelector } from "react-redux";

const RoomChatScreen = () => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    flex: 1,
    backgroundColor: c.background,
  },
  flex: {
    flex: 1,
  },
  pinBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  pinBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: c.primary,
    minWidth: 18,
    textAlign: "center",
  },

}));

  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  useAutoMarkRoomFileNotificationsRead(roomId);
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  const [pinsOpen, setPinsOpen] = useState(false);

  const { data: roomDetails } = useGetRoomDetailsQuery(roomId || "", {
    skip: !roomId,
  });

  const boundChannelId = useMemo(() => {
    if (!roomId) return null;
    return roomDetails?.channelId ?? roomId;
  }, [roomId, roomDetails?.channelId]);

  const currentUserId = useMemo(() => {
    if (user?.id) return String(user.id);
    return getUserIdFromAccessToken(accessToken) ?? "";
  }, [user?.id, accessToken]);

  const userNamesMap = useChatUserNamesMap(roomDetails, user);

  const senderDisplayName = useMemo(() => {
    const fromProfile = user?.firstName?.trim();
    if (fromProfile) return fromProfile;
    const fromEmail = user?.email?.split("@")[0]?.trim();
    if (fromEmail) return fromEmail;
    if (currentUserId) return userNamesMap.get(currentUserId);
    return undefined;
  }, [user?.firstName, user?.email, currentUserId, userNamesMap]);

  const shouldConnectWs = Boolean(currentUserId && roomId);

  useWebSocket(shouldConnectWs);

  const {
    messages,
    loadingMessages,
    sendMessage,
    sendTyping,
    sendRead,
    toggleReaction,
    editMessage,
    deleteMessage,
    togglePin,
    replyTo,
    setReplyTo,
    pinnedMessages,
    typingUserIds,
    readReceipts,
  } = useChat(currentUserId, { boundChannelId, senderDisplayName });

  const handleSend = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      sendMessage(content.trim());
    },
    [sendMessage]
  );

  const pinHeaderAction = useMemo(
    () => (
      <Pressable
        onPress={() => setPinsOpen(true)}
        style={styles.pinBtn}
        hitSlop={10}
      >
        <Feather name="bookmark" size={20} color={themeColors.primary} />
        {pinnedMessages.length > 0 ? (
          <Text style={styles.pinBadge}>{pinnedMessages.length}</Text>
        ) : null}
      </Pressable>
    ),
    [pinnedMessages.length]
  );

  if (!roomId) {
    return (
      <View style={styles.container}>
        <Header title="Chat" />
      </View>
    );
  }

  return (
    <ChatUserNamesProvider namesById={userNamesMap}>
      <View style={styles.container}>
        <Header title="Chat" rightAction={pinHeaderAction} />
        <PinnedMessagesModal
          visible={pinsOpen}
          onClose={() => setPinsOpen(false)}
          messages={pinnedMessages}
          onUnpin={togglePin}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          style={styles.flex}
        >
          <MessageList
            channelId={boundChannelId}
            messages={messages}
            currentUserId={currentUserId}
            loading={loadingMessages}
            onReaction={toggleReaction}
            onReply={setReplyTo}
            onEdit={editMessage}
            onDelete={deleteMessage}
            onPin={togglePin}
            onRead={sendRead}
            typingUserIds={typingUserIds}
            readReceipts={readReceipts}
          />
          <MessageInput
            onSend={handleSend}
            onTyping={sendTyping}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />
        </KeyboardAvoidingView>
      </View>
    </ChatUserNamesProvider>
  );
};

export default RoomChatScreen;
