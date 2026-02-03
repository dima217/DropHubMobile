import { useGetChatMessagesQuery } from "@/api/chatApi";
import { ChatMessage as ApiChatMessage } from "@/api/types/chat";
import { Colors } from "@/constants/design-tokens";
import { useRoomChat, ChatMessage as WSChatMessage } from "@/hooks/data/useMessage";
import { secureStore } from "@/services/secureStore";
import Header from "@/shared/Header";
import View from "@/shared/View";
import { RootState } from "@/store/store";
import ChatInput from "@/widgets/rooms/components/Chat/ChatInput";
import MessageList, { Message } from "@/widgets/rooms/components/Chat/MessageList";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";

type UnifiedChatMessage = ApiChatMessage & { roomId?: string };

const convertToMessage = (msg: UnifiedChatMessage): Message => ({
  id: msg.id,
  content: msg.content,
  createdAt: msg.createdAt,
  author: msg.author,
});

const RoomChatScreen = () => {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<UnifiedChatMessage[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const { data: initialMessages, isLoading } = useGetChatMessagesQuery(
    { roomId: roomId || "" },
    { skip: !roomId }
  );

  useEffect(() => {
    secureStore.getAccessToken().then(setAccessToken);
  }, []);

  useEffect(() => {
    if (initialMessages) {
      setMessages(
        initialMessages.map((msg) => ({
          ...msg,
          roomId: roomId || "",
          author: {
            ...msg.author,
            profile: msg.author.profile ?? null,
          },
        }))
      );
    }
  }, [initialMessages, roomId]);

  const messagesList = useMemo(() => {
    return messages.map(convertToMessage);
  }, [messages]);

  const handleNewMessage = useCallback((message: WSChatMessage) => {
    setMessages((prev) => {
      if (prev.some((m) => m.id === message.id)) {
        return prev;
      }
      const unifiedMessage: UnifiedChatMessage = {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
        roomId: message.roomId,
        author: {
          id: message.author.id.toString(),
          email: message.author.email,
          profile: message.author.profile ?? null,
        },
      };
      return [...prev, unifiedMessage];
    });
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  const handleMessageUpdated = useCallback((message: WSChatMessage) => {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === message.id) {
          return {
            id: message.id,
            content: message.content,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
            roomId: message.roomId,
            author: {
              id: message.author.id.toString(),
              email: message.author.email,
              profile: message.author.profile ?? null,
            },
          };
        }
        return m;
      })
    );
  }, []);

  const handleMessageDeleted = useCallback((payload: { id: string }) => {
    setMessages((prev) => prev.filter((m) => m.id !== payload.id));
  }, []);

  const { sendMessage, isConnected } = useRoomChat(
    roomId || "",
    accessToken || "",
    {
      onNewMessage: handleNewMessage,
      onMessageUpdated: handleMessageUpdated,
      onMessageDeleted: handleMessageDeleted,
    },
    !!roomId && !!accessToken
  );

  const handleSendMessage = useCallback(() => {
    if (!messageText.trim() || !isConnected) {
      return;
    }
    sendMessage(messageText.trim());
    setMessageText("");
  }, [messageText, sendMessage, isConnected]);

  const sortedMessages = useMemo(() => {
    return [...messagesList].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [messagesList]);

  const isMyMessage = useCallback(
    (message: Message) => {
      return message.author.id === user?.id;
    },
    [user]
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Chat" />
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={styles.loader}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Chat" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <MessageList
          ref={flatListRef}
          messages={sortedMessages}
          isMyMessage={isMyMessage}
        />
        <ChatInput
          messageText={messageText}
          onMessageTextChange={setMessageText}
          onSend={handleSendMessage}
          isConnected={isConnected}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
    paddingBottom: 16,
  },
  loader: {
    marginTop: 50,
  },
});

export default RoomChatScreen;

