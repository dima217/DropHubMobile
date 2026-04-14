import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import {
  ArchiveRoomToStorageRequest,
  ArchiveRoomToStorageResponse,
  CopyStorageItemRequest,
  CopyStorageItemResponse,
  CreateStorageFolderRequest,
  CreateStorageFolderResponse,
  CreateStorageResponse,
  DeleteStorageItemRequest,
  DeleteStorageItemResponse,
  GetStorageInfoResponse,
  GetStorageStructureRequest,
  GetTrashItemsRequest,
  GetTrashItemsResponse,
  MoveStorageItemRequest,
  MoveStorageItemResponse,
  MoveStorageItemToTrashRequest,
  MoveStorageItemToTrashResponse,
  RemoveStorageTagsRequest,
  RemoveStorageTagsResponse,
  RestoreTrashItemRequest,
  RestoreTrashItemResponse,
  StorageItem,
  UpdateStorageItemRequest,
  UpdateStorageItemResponse,
  UpdateStorageItemTagsRequest,
  UpdateStorageItemTagsResponse,
} from "./types/storage";

export const storageApi = createApi({
  reducerPath: "storageApi",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["Storage", "StorageInfo", "StorageTrash"],
  endpoints: (build) => ({
    createStorage: build.mutation<CreateStorageResponse, void>({
      query: () => ({ url: "/storage/create", method: "POST", auth: true }),
      invalidatesTags: ["StorageInfo"],
    }),
    getStorageStructure: build.query<StorageItem[], GetStorageStructureRequest>({
      query: (body) => ({
        url: "/storage/structure",
        method: "POST",
        body,
        auth: true,
      }),
      providesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
      ],
    }),
    createStorageFolder: build.mutation<
      CreateStorageFolderResponse,
      CreateStorageFolderRequest
    >({
      query: (body) => ({
        url: "/storage/create-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
      ],
    }),
    updateStorageItem: build.mutation<
      UpdateStorageItemResponse,
      UpdateStorageItemRequest
    >({
      query: (body) => ({
        url: "/storage/rename-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
      ],
    }),
    moveStorageItem: build.mutation<
      MoveStorageItemResponse,
      MoveStorageItemRequest
    >({
      query: (body) => ({
        url: "/storage/move-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
      ],
    }),
    moveStorageItemToTrash: build.mutation<
      MoveStorageItemToTrashResponse,
      MoveStorageItemToTrashRequest
    >({
      query: (body) => ({
        url: "/storage/delete-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
        { type: "StorageTrash" as const, id: arg.storageId },
        "StorageInfo",
      ],
    }),
    getTrashItems: build.query<
      GetTrashItemsResponse[],
      GetTrashItemsRequest
    >({
      query: (body) => ({
        url: "/storage/trash",
        method: "POST",
        body,
        auth: true,
      }),
      providesTags: (result, error, arg) => [
        { type: "StorageTrash" as const, id: arg.storageId },
      ],
    }),
    restoreTrashItem: build.mutation<
      RestoreTrashItemResponse,
      RestoreTrashItemRequest
    >({
      query: (body) => ({
        url: "/storage/restore-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "StorageTrash" as const, id: arg.storageId },
        { type: "Storage" as const, id: arg.storageId },
        "StorageInfo",
      ],
    }),
    copyStorageItem: build.mutation<
      CopyStorageItemResponse,
      CopyStorageItemRequest
    >({
      query: (body) => ({
        url: "/storage/copy-item",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
        "StorageInfo",
      ],
    }),
    deleteStorageItem: build.mutation<
      DeleteStorageItemResponse,
      DeleteStorageItemRequest
    >({
      query: (body) => ({
        url: "/storage/delete-item-permanent",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "StorageTrash" as const, id: arg.storageId },
        { type: "Storage" as const, id: arg.storageId },
        "StorageInfo",
      ],
    }),
    updateStorageItemTags: build.mutation<
      UpdateStorageItemTagsResponse,
      UpdateStorageItemTagsRequest
    >({
      query: (body) => ({
        url: "/storage/update-item-tags",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
        "StorageInfo",
      ],
    }),
    removeStorageTags: build.mutation<
      RemoveStorageTagsResponse,
      RemoveStorageTagsRequest
    >({
      query: (body) => ({
        url: "/storage/remove-storage-tags",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        "StorageInfo",
        { type: "Storage" as const, id: arg.storageId },
      ],
    }),
    getStorageInfo: build.query<GetStorageInfoResponse, void>({
      query: () => ({ url: "/storage", method: "GET", auth: true }),
      providesTags: ["StorageInfo"],
    }),
    archiveRoomToStorage: build.mutation<
      ArchiveRoomToStorageResponse,
      ArchiveRoomToStorageRequest
    >({
      query: (body) => ({
        url: "/storage/archive-room",
        method: "POST",
        body,
        auth: true,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Storage" as const, id: arg.storageId },
        "StorageInfo",
      ],
    }),
  }),
});

export const {
  useCreateStorageMutation,
  useGetStorageStructureQuery,
  useCreateStorageFolderMutation,
  useUpdateStorageItemMutation,
  useMoveStorageItemMutation,
  useMoveStorageItemToTrashMutation,
  useGetTrashItemsQuery,
  useRestoreTrashItemMutation,
  useCopyStorageItemMutation,
  useDeleteStorageItemMutation,
  useUpdateStorageItemTagsMutation,
  useRemoveStorageTagsMutation,
  useGetStorageInfoQuery,
  useArchiveRoomToStorageMutation,
} = storageApi;
