import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { AcceptFriendRequestRequest, AcceptFriendRequestResponse, AddFriendRequest, AddFriendResponse, CancelFriendRequestRequest, CancelFriendRequestResponse, Friend, FriendRequestResponse, RejectFriendRequestRequest, RejectFriendRequestResponse, RemoveFriendRequest, RemoveFriendResponse } from "./types/friend";

export const friendApi = createApi({
  reducerPath: "friendApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["FriendRequest"], 
  endpoints: (build) => ({
    getFriends: build.query<Friend[], void>({
      query: () => ({ url: "/relationships/friends", method: "POST", auth: true }),
    }),
    
    addFriend: build.mutation<AddFriendResponse, AddFriendRequest>({
      query: (body) => ({
        url: "/relationships/request",
        method: "POST",
        body,
        auth: true,
      }),
    }),

    removeFriend: build.mutation<RemoveFriendResponse, RemoveFriendRequest>({
      query: ({ friendshipId }) => ({ url: `/relationships/friends/${friendshipId}`, method: "DELETE", auth: true }),
    }),

    cancelFriendRequest: build.mutation<CancelFriendRequestResponse, CancelFriendRequestRequest>({
      query: ({ requestId }) => ({ url: `/relationships/cancel/${requestId}`, method: "POST", auth: true }),
    }),

    getFriendRequests: build.query<FriendRequestResponse[], void>({
      query: () => ({ url: "/relationships/requests", method: "POST", auth: true }),
      providesTags: (result) =>
        result ? result.map(({ requestId }) => ({ type: "FriendRequest" as const, id: requestId })) : [],
    }),

    acceptFriendRequest: build.mutation<AcceptFriendRequestResponse, AcceptFriendRequestRequest>({
      query: ({ requestId }) => ({ url: `/relationships/accept/${requestId}`, method: "POST", auth: true }),
      invalidatesTags: [{ type: "FriendRequest", id: "LIST" }],
    }),

    rejectFriendRequest: build.mutation<RejectFriendRequestResponse, RejectFriendRequestRequest>({
      query: ({ requestId }) => ({ url: `/relationships/reject/${requestId}`, method: "POST", auth: true }),
      invalidatesTags: [{ type: "FriendRequest", id: "LIST" }],
    }),
  }),
});

export const { 
    useGetFriendsQuery,
    useAddFriendMutation,
    useGetFriendRequestsQuery,
    useAcceptFriendRequestMutation,
    useRejectFriendRequestMutation,
    useCancelFriendRequestMutation,
    useRemoveFriendMutation,
} = friendApi;