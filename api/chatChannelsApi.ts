import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import type {
  ChatChannelMembersResponse,
  ChatChannelMessagesResponse,
  ChatChannelsListResponse,
  CreateChatChannelRequest,
  CreateChatChannelResponse,
} from "./types/chatChannels";

export const chatChannelsApi = createApi({
  reducerPath: "chatChannelsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["ChatChannels", "ChatChannelMessages", "ChatChannelMembers"],
  endpoints: (build) => ({
    getChatChannels: build.query<ChatChannelsListResponse, void>({
      query: () => ({
        url: "api/chat/channels",
        method: "GET",
        auth: true,
      }),
      providesTags: ["ChatChannels"],
    }),

    getChatChannelMessages: build.query<
      ChatChannelMessagesResponse,
      { channelId: string }
    >({
      query: ({ channelId }) => ({
        url: `api/chat/channels/${channelId}/messages`,
        method: "GET",
        auth: true,
      }),
      providesTags: (result, error, { channelId }) => [
        { type: "ChatChannelMessages", id: channelId },
      ],
    }),

    getChatChannelMembers: build.query<
      ChatChannelMembersResponse,
      { channelId: string }
    >({
      query: ({ channelId }) => ({
        url: `api/chat/channels/${channelId}/members`,
        method: "GET",
        auth: true,
      }),
      providesTags: (result, error, { channelId }) => [
        { type: "ChatChannelMembers", id: channelId },
      ],
    }),

    createChatChannel: build.mutation<
      CreateChatChannelResponse,
      CreateChatChannelRequest
    >({
      query: (body) => ({
        url: "api/chat/channels",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: ["ChatChannels"],
    }),

    addChatChannelMembers: build.mutation<
      { added: { user_id: string; type: string }[]; channel_id: string },
      { channelId: string; memberIds: string[] }
    >({
      query: ({ channelId, memberIds }) => ({
        url: `api/chat/channels/${channelId}/members`,
        method: "POST",
        body: { member_ids: memberIds },
        auth: true,
      }),
      invalidatesTags: (result, error, { channelId }) => [
        { type: "ChatChannelMembers", id: channelId },
        "ChatChannels",
      ],
    }),

    removeChatChannelMember: build.mutation<
      { removed: string; channel_id: string },
      { channelId: string; userId?: string }
    >({
      query: ({ channelId, userId }) => ({
        url: `api/chat/channels/${channelId}/members`,
        method: "DELETE",
        body: userId ? { user_id: userId } : {},
        auth: true,
      }),
      invalidatesTags: (result, error, { channelId }) => [
        { type: "ChatChannelMembers", id: channelId },
        "ChatChannels",
      ],
    }),
  }),
});

export const {
  useGetChatChannelsQuery,
  useLazyGetChatChannelsQuery,
  useGetChatChannelMessagesQuery,
  useLazyGetChatChannelMessagesQuery,
  useGetChatChannelMembersQuery,
  useCreateChatChannelMutation,
  useAddChatChannelMembersMutation,
  useRemoveChatChannelMemberMutation,
} = chatChannelsApi;
