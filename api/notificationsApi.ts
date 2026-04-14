import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import type {
  AppNotification,
  GetNotificationsQuery,
  MarkNotificationsReadRequest,
  MarkNotificationsReadResponse,
} from "./types/notification";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Notifications"],
  endpoints: (build) => ({
    getNotifications: build.query<AppNotification[], GetNotificationsQuery | void>({
      query: (params) => {
        const limit = params?.limit ?? 20;
        const offset = params?.offset ?? 0;
        return `/profile/notifications?limit=${limit}&offset=${offset}`;
      },
      providesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    markNotificationsRead: build.mutation<
      MarkNotificationsReadResponse,
      MarkNotificationsReadRequest
    >({
      query: (body) => ({
        url: "/profile/notifications/read",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
  }),
});

export const { useGetNotificationsQuery, useMarkNotificationsReadMutation } =
  notificationsApi;
