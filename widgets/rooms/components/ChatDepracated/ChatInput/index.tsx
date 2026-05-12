import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useThemeColors } from "@/hooks/useThemeColors";

import { ThemedText } from "@/shared/core/ThemedText";
import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  Platform,
  TextInput as RNTextInput,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ChatInputProps {
  messageText: string;
  onMessageTextChange: (text: string) => void;
  onSend: () => void;
  isConnected: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  messageText,
  onMessageTextChange,
  onSend,
  isConnected,
}) => {
  const themeColors = useThemeColors();
  const styles = useThemedStyles((c) => ({

  container: {
    backgroundColor: c.background,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
  },
  inputContainer: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    backgroundColor: c.border,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "ios" ? 10 : 8,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  textInput: {
    color: c.text,
    fontSize: 15,
    padding: 0,
    margin: 0,
    maxHeight: 80,
    minHeight: 24,
    textAlignVertical: "center",
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: c.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 0,
  },
  sendButtonDisabled: {
    backgroundColor: c.inactive,
  },
  connectionStatus: {
    fontSize: 11,
    color: c.secondary,
    textAlign: "center",
    marginTop: 6,
  },

}));

  const insets = useSafeAreaInsets();
  const canSend = messageText.trim().length > 0 && isConnected;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, 12),
          paddingTop: 12,
        },
      ]}
    >
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <RNTextInput
            value={messageText}
            onChangeText={onMessageTextChange}
            placeholder="Type a message..."
            placeholderTextColor={themeColors.secondary}
            style={styles.textInput}
            multiline
            maxLength={1000}
            returnKeyType="send"
            onSubmitEditing={canSend ? onSend : undefined}
            blurOnSubmit={false}
            textAlignVertical="center"
          />
        </View>
        <TouchableOpacity
          style={[
            styles.sendButton,
            !canSend && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
          disabled={!canSend}
          activeOpacity={0.7}
        >
          <Feather
            name="send"
            size={18}
            color={canSend ? themeColors.brightText : themeColors.secondary}
          />
        </TouchableOpacity>
      </View>
      {!isConnected && (
        <ThemedText style={styles.connectionStatus}>
          Connecting...
        </ThemedText>
      )}
    </View>
  );
};

export default ChatInput;
