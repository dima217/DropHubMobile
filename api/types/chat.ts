export interface ChatMessage {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: {
      id: string;
      email: string;
      profile: {
        firstName: string;
        avatarUrl: string;
      } | null;
    };
}

export interface GetChatMessagesRequest {
    roomId: string;
}