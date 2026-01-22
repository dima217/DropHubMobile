import { shouldRefreshToken } from "@/services/auth/TokenExpireChecker";
import { secureStore } from "@/services/secureStore";
import { clearAuth, setAccessToken } from "@/store/slices/authSlice";
import {
  BaseQueryFn,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { FetchArgsWithAuth } from "./types/base";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "http://84.201.188.209:3000",
  credentials: "include",
  prepareHeaders: async (headers, { getState }) => {
    const token = await secureStore.getAccessToken();

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("x-client-type", "mobile-app");

    return headers;
  },
});

const refreshTokens = async (api: any): Promise<boolean> => {
  const refreshToken = await secureStore.getRefreshToken();

  try {
    const response = await fetch(
      "http://84.201.188.209:3000/auth/new-access-token",
      {
        method: "POST",
        headers: {
          ...(refreshToken && {
            Authorization: `Bearer ${refreshToken}`,
          }),
          "x-client-type": "mobile-app",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const data = await response.json();

    await secureStore.setAccessToken(data.accessToken);
    await secureStore.setRefreshToken(data.refreshToken);
    api.dispatch(setAccessToken({ accessToken: data.accessToken }));
    return true;
  } catch (error) {
    api.dispatch(clearAuth());
    console.error("Refresh tokens error:", error);
    return false;
  }
};

export const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgsWithAuth,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const authRequired = typeof args === "string" ? true : args.auth !== false;
  if (authRequired) {
    const accessToken = await secureStore.getAccessToken();
    let shouldRefresh = shouldRefreshToken(accessToken);

    if (shouldRefresh) {
      console.log("Token needs refresh, refreshing before request...");
      const refreshed = await refreshTokens(api);

      if (!refreshed) {
        api.dispatch(clearAuth());
        const error: FetchBaseQueryError = {
          status: 401,
          data: "Failed to refresh token",
        };

        return { error };
      }
    }
  }

  const result = await rawBaseQuery(args, api, extraOptions);
  return result;
};
