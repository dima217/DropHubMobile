/** Types for chat REST (`/api/chat/...`) and WebSocket `chat.*` events. */
export interface ChatChannel {
  channel_id: string;
  name: string;
  type: "direct" | "group";
  created_by: string;
  created_at: string;
  member_count: number;
  last_message_at: number;
  last_message_preview: string;
  last_message_by?: string;
  muted: boolean;
  role: string;
  description?: string;
}

export interface ChatChannelMessage {
  message_id: string;
  channel_id: string;
  sender_id: string;
  sender_type: string;
  content: string;
  content_type: string;
  created_at: string;
  created_at_epoch: number;
  sender_display_name?: string;
  reply_to?: string;
  mentions?: string[];
  attachments?: { url: string; name: string; size: number }[];
  reactions?: Record<string, string[]>;
  client_request_id?: string;
  edited_at?: string;
  deleted_at?: string;
  deleted_by?: string;
  pinned_at?: string;
  pinned_by?: string;
  status?: "sending" | "sent" | "delivered" | "read";
}

export interface ChatChannelsListResponse {
  items: ChatChannel[];
  count: number;
}

export interface ChatChannelMessagesResponse {
  items: ChatChannelMessage[];
  count: number;
  read_cursor: Record<string, string>;
}

export interface ChatChannelMemberRow {
  user_id: string;
  member_type: string;
  role: string;
  joined_at: string;
}

export interface ChatChannelMembersResponse {
  items: ChatChannelMemberRow[];
  count: number;
  channel_id: string;
}

export interface CreateChatChannelRequest {
  name: string;
  type: string;
  member_ids: string[];
  description?: string;
}

export interface CreateChatChannelResponse {
  channel_id: string;
  name: string;
  type: string;
  member_count: number;
  created_at: string;
}
