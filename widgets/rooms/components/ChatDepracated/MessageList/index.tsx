import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from "@/shared/core/ThemedText";
import View from "@/shared/View";
import React, { forwardRef } from "react";
import { FlatList, ListRenderItem, StyleSheet } from "react-native";
import MessageBubble from "../MessageBubble";

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    email: string;
    profile?: {
      firstName: string;
      avatarUrl: string;
    } | null;
  };
}

interface MessageListProps {
  messages: Message[];
  isMyMessage: (message: Message) => boolean;
}

const MessageList = forwardRef<FlatList, MessageListProps>(
  ({ messages, isMyMessage }, ref) => {
  const styles = useThemedStyles((c) => ({

  messagesList: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: c.secondary,
    textAlign: "center",
  },

}));

    const renderMessage: ListRenderItem<Message> = ({ item }) => (
      <MessageBubble message={item} isMyMessage={isMyMessage(item)} />
    );

    return (
      <FlatList
        ref={ref}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => {
          if (ref && "current" in ref && ref.current) {
            ref.current.scrollToEnd({ animated: true });
          }
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <ThemedText style={styles.emptyText}>
              No messages yet. Start the conversation!
            </ThemedText>
          </View>
        }
      />
    );
  }
);

MessageList.displayName = "MessageList";

export default MessageList;
