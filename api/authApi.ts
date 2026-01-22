// src/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import {
  MeResponse,
  RefreshTokenResponse,
  SignInRequest,
  SignInResponse,
  SignUpConfirmRequest,
  SignUpConfirmResponse,
} from "./types/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (build) => ({
    signIn: build.mutation<SignInResponse, SignInRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
        auth: false,
      }),
    }),

    signUp: build.mutation<SignUpConfirmResponse, SignUpConfirmRequest>({
      query: (body) => ({
        url: "/auth/sign-up",
        method: "POST",
        body,
        auth: false,
      }),
    }),

    signOut: build.mutation<void, void>({
      query: () => ({ url: "/auth/sign-out", method: "POST", auth: false }),
    }),

    refreshToken: build.query<RefreshTokenResponse, void>({
      query: () => ({
        url: "/auth/new-access-token",
        method: "POST",
        auth: true,
      }),
    }),

    profile: build.query<MeResponse, void>({
      query: () => ({ url: "/profile", method: "GET", auth: true }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation,
  useRefreshTokenQuery,
  useProfileQuery,
} = authApi;
