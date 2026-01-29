// src/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";

export const avatarApi = createApi({
  reducerPath: "avatarApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    getDefaultsAvatars: build.query<string[], void>({
      query: () => ({
        url: "/avatars/defaults",
        method: "GET",
        auth: false,
      }),
    }),

    getDefaultAvatar: build.query<string, number>({
      query: (id) => ({
        url: `/avatars/defaults/${id}`,
        method: "GET",
        auth: false,
      }),
    }),
  }),
});

export const {
  useGetDefaultsAvatarsQuery,
  useGetDefaultAvatarQuery,
} = avatarApi;
