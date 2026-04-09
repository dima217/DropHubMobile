import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import {
  AddFavoriteFromSharedRequest,
  AddFavoriteFromSharedResponse,
  AddFavoriteFromStorageRequest,
  AddFavoriteFromStorageResponse,
  GetFavoritesResponse,
  RemoveFavoriteFromSharedRequest,
  RemoveFavoriteFromSharedResponse,
  RemoveFavoriteFromStorageRequest,
  RemoveFavoriteFromStorageResponse,
} from "./types/favorites";

export const favoritesApi = createApi({
  reducerPath: "favoritesApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Favorites"],
  endpoints: (build) => ({
    getFavorites: build.query<GetFavoritesResponse, void>({
      query: () => ({ url: "/favorites", method: "POST", auth: true }),
      providesTags: ["Favorites"],
    }),
    addFavoriteFromStorage: build.mutation<
      AddFavoriteFromStorageResponse,
      AddFavoriteFromStorageRequest
    >({
      query: (body) => ({
        url: "/favorites/storage-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: ["Favorites"],
    }),
    addFavoriteFromShared: build.mutation<
      AddFavoriteFromSharedResponse,
      AddFavoriteFromSharedRequest
    >({
      query: (body) => ({
        url: "/favorites/shared-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFavoriteFromStorage: build.mutation<
      RemoveFavoriteFromStorageResponse,
      RemoveFavoriteFromStorageRequest
    >({
      query: (body) => ({
        url: "/favorites/storage-item",
        method: "DELETE",
        body,
        auth: true,
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFavoriteFromShared: build.mutation<
      RemoveFavoriteFromSharedResponse,
      RemoveFavoriteFromSharedRequest
    >({
      query: (body) => ({
        url: "/favorites/remove-from-shared",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: ["Favorites"],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteFromStorageMutation,
  useAddFavoriteFromSharedMutation,
  useRemoveFavoriteFromStorageMutation,
  useRemoveFavoriteFromSharedMutation,
} = favoritesApi;