// src/api/authApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import {
  MeResponse,
  ProfileResponse,
  ProfileUploadUrlResponse,
  RefreshTokenResponse,
  ResetPasswordConfirmRequest,
  ResetPasswordConfirmResponse,
  ResetPasswordInitRequest,
  SignInRequest,
  SignInResponse,
  SignUpConfirmRequest,
  SignUpConfirmResponse,
  SignUpInitRequest,
  SignUpVerifyCodeRequest,
  SignUpVerifyCodeResponse,
  UpdateProfileRequest,
  UpdateProfileResponse
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

    signUpInit: build.mutation<void, SignUpInitRequest>({
      query: (body) => ({
        url: "/auth/sign-up-init",
        method: "POST",
        body,
        auth: false,
      }),
    }),

    signUpVerifyCode: build.mutation<
      SignUpVerifyCodeResponse,
      SignUpVerifyCodeRequest
    >({
      query: (body) => ({
        url: "/auth/sign-up-verify-code",
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

    resetPasswordInit: build.mutation<void, ResetPasswordInitRequest>({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
        auth: false,
      }),
    }),

    resetPasswordConfirm: build.mutation<ResetPasswordConfirmResponse, ResetPasswordConfirmRequest>({
      query: (body) => ({
        url: "/auth/forgot-password/reset",
        method: "POST",
        body,
        auth: false,
      }),
    }),

    profile: build.query<MeResponse, void>({
      query: () => ({ url: "/profile", method: "GET", auth: true }),
    }),

    getProfileUploadUrl: build.query<ProfileUploadUrlResponse, void>({
      query: () => ({ url: "/profile/upload-url", method: "GET", auth: true }),
    }),

    updateProfile: build.mutation<UpdateProfileResponse, UpdateProfileRequest>({
      query: (profileData) => ({
        url: "/profile/update",
        method: "POST",
        body: profileData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    searchProfiles: build.query<ProfileResponse[], string>({
      query: (query) => ({
        url: "/profile/search",
        method: "GET",
        params: { query },
        auth: true,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpInitMutation,
  useSignUpMutation,
  useSignOutMutation,
  useRefreshTokenQuery,
  useProfileQuery,
  useResetPasswordInitMutation,
  useResetPasswordConfirmMutation,
  useSignUpVerifyCodeMutation,
  useUpdateProfileMutation,
  useGetProfileUploadUrlQuery,
  useSearchProfilesQuery,
} = authApi;
