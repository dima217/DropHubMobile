import { useThemedStyles } from "@/hooks/useThemedStyles";

import { ThemedText } from "@/shared/core/ThemedText";
import Avatar from "@/widgets/profile/components/ProfileCard/ui/Avatar";
import React from "react";
import { StyleSheet, View } from "react-native";

export interface MessageBubbleProps {
  message: {
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
  };
  isMyMessage: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMyMessage,
}) => {
  const styles = useThemedStyles((c) => ({

  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-end",
    paddingHorizontal: 4,
  },
  myMessageContainer: {
    justifyContent: "flex-end",
  },
  otherMessageContainer: {
    justifyContent: "flex-start",
  },
  avatarContainer: {
    marginRight: 8,
    marginBottom: 2,
  },
  messageBubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myMessageBubble: {
    backgroundColor: c.primary,
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: c.cardBackground,
    borderBottomLeftRadius: 4,
  },
  authorName: {
    fontSize: 12,
    fontWeight: "600",
    color: c.primary,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  myMessageText: {
    color: c.brightText,
  },
  otherMessageText: {
    color: c.text,
  },
  messageTime: {
    fontSize: 10,
    marginTop: 6,
    opacity: 0.7,
  },
  myMessageTime: {
    color: c.brightText,
    textAlign: "right",
  },
  otherMessageTime: {
    color: c.text,
    textAlign: "left",
  },

}));

  const authorName =
    message.author.profile?.firstName ||
    message.author.email?.split("@")[0] ||
    "User";
  const authorAvatar = message.author.profile?.avatarUrl;
  const initial = authorName[0]?.toUpperCase() || "?";

  return (
    <View
      style={[
        styles.messageContainer,
        isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer,
      ]}
    >
      {!isMyMessage && (
        <View style={styles.avatarContainer}>
          <Avatar size="small" uri={authorAvatar} title={initial} />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          isMyMessage ? styles.myMessageBubble : styles.otherMessageBubble,
        ]}
      >
        {!isMyMessage && (
          <ThemedText style={styles.authorName}>{authorName}</ThemedText>
        )}
        <ThemedText
          style={[
            styles.messageText,
            isMyMessage ? styles.myMessageText : styles.otherMessageText,
          ]}
        >
          {message.content}
        </ThemedText>
        <ThemedText
          style={[
            styles.messageTime,
            isMyMessage ? styles.myMessageTime : styles.otherMessageTime,
          ]}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </ThemedText>
      </View>
    </View>
  );
};

export default MessageBubble;
