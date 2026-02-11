import { useCallback, useEffect } from 'react';
import { useWebSocket } from '../websocket/useWebSocket';

const WS_URL = 'http://10.78.194.195:3000';

export interface ChatMessage {
  id: string;
  roomId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    email: string;
    profile?: {
      firstName: string;
      avatarUrl: string;
    } | null;
  };
}

export const useRoomChat = (
  roomId: string,
  accessToken: string,
  {
    onNewMessage,
    onMessageUpdated,
    onMessageDeleted,
  }: {
    onNewMessage?: (message: ChatMessage) => void;
    onMessageUpdated?: (message: ChatMessage) => void;
    onMessageDeleted?: (payload: { id: string }) => void;
  },
  isEnabled: boolean
) => {
  const { isConnected, on, off, emit } = useWebSocket(WS_URL, accessToken);

  /* ================= JOIN / LEAVE ================= */

  useEffect(() => {
    if (!isConnected || !isEnabled || !roomId) return;

    emit('join_room', { roomId });

    return () => {
      emit('leave_room', { roomId });
    };
  }, [isConnected, isEnabled, roomId, emit]);

  /* ================= LISTENERS ================= */

  useEffect(() => {
    if (!isConnected || !isEnabled) return;

    if (onNewMessage) on('new_message', onNewMessage);
    if (onMessageUpdated) on('message_updated', onMessageUpdated);
    if (onMessageDeleted) on('message_deleted', onMessageDeleted);

    return () => {
      if (onNewMessage) off('new_message', onNewMessage);
      if (onMessageUpdated) off('message_updated', onMessageUpdated);
      if (onMessageDeleted) off('message_deleted', onMessageDeleted);
    };
  }, [
    isConnected,
    isEnabled,
    on,
    off,
    onNewMessage,
    onMessageUpdated,
    onMessageDeleted,
  ]);

  /* ================= ACTIONS ================= */

  const sendMessage = useCallback(
    (content: string) => {
      if (!roomId) return;

      console.log('[sendMessage] emit', { content, roomId });

      emit('send_message', {
        roomId: roomId.toString(),
        content: content.toString(),
      });
      console.log('[sendMessage] emitted', { content, roomId });

    },
    [emit, roomId],
  );

  const updateMessage = useCallback(
    (commentId: string, content: string) => {
      emit('update_message', {
        commentId,
        content,
      });
    },
    [emit],
  );

  const deleteMessage = useCallback(
    (commentId: string) => {
      emit('delete_message', {
        commentId,
      });
    },
    [emit],
  );

  return {
    isConnected,
    sendMessage,
    updateMessage,
    deleteMessage,
  };
};
