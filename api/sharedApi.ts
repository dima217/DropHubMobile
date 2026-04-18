import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import {
  CreateSharedItemRequest,
  CreateSharedItemResponse,
  GetSharedItemParticipantResponse,
  GetSharedItemParticipantsRequest,
  GetSharedResourcesResponse,
  GetSharedStructureRequest,
  GrantPermissionsRequest,
  GrantPermissionsResponse,
  RevokePermissionsRequest,
} from "./types/shared";
import { StorageItem } from "./types/storage";

export const sharedApi = createApi({
  reducerPath: "sharedApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Shared", "SharedParticipants", "SharedResources"],
  endpoints: (build) => ({
    grantPermissions: build.mutation<
      GrantPermissionsResponse,
      GrantPermissionsRequest
    >({
      query: (body) => ({
        url: "/storage/shared/grant-permission",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Shared" as const, id: arg.resourceId },
        { type: "SharedResources" as const, id: arg.storageId },
      ],
    }),
    getSharedResources: build.query<GetSharedResourcesResponse[], void>({
      query: () => ({
        url: "/storage/shared/get-items",
        method: "POST",
        auth: true,
      }),
      providesTags: ["SharedResources"],
    }),
    revokePermissions: build.mutation<void, RevokePermissionsRequest>({
      query: (body) => ({
        url: "/storage/shared/revoke-permission",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Shared" as const, id: arg.resourceId },
        { type: "SharedParticipants" as const, id: arg.resourceId },
      ],
    }),
    getSharedStructure: build.query<StorageItem[], GetSharedStructureRequest>({
      query: (body) => ({
        url: "/storage/structure",
        method: "POST",
        body,
        auth: true,
      }),
      providesTags: (result, error, arg) => [
        { type: "Shared" as const, id: arg.resourceId },
      ],
    }),
    getSharedItemParticipants: build.query<
      GetSharedItemParticipantResponse[],
      GetSharedItemParticipantsRequest
    >({
      query: (body) => ({
        url: "/storage/shared/get-item-participants",
        method: "POST",
        body,
        auth: true,
      }),
      providesTags: (result, error, arg) => [
        { type: "SharedParticipants" as const, id: arg.itemId },
      ],
    }),
    createSharedItem: build.mutation<
      CreateSharedItemResponse,
      CreateSharedItemRequest
    >({
      query: (body) => ({
        url: "/storage/create-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Shared" as const, id: arg.resourceId },
      ],
    }),
  }),
});

export const {
  useGrantPermissionsMutation,
  useGetSharedResourcesQuery,
  useRevokePermissionsMutation,
  useGetSharedStructureQuery,
  useGetSharedItemParticipantsQuery,
  useCreateSharedItemMutation,
} = sharedApi;