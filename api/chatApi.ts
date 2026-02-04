import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { ChatMessage, GetChatMessagesRequest } from "./types/chat";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["ChatMessages"],
  endpoints: (build) => ({
    getChatMessages: build.query<ChatMessage[], GetChatMessagesRequest>({
      query: (body) => ({ url: `comments/get`, method: "POST", body, auth: true }),
      providesTags: (result, error, { roomId }) => [
        { type: "ChatMessages", id: roomId },
      ],
    }),
  }),
});

export const { useGetChatMessagesQuery } = chatApi;