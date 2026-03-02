import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { DeleteRoomFilesRequest, DeleteRoomFilesResponse, DownloadRoomFilesRequest, DownloadRoomFilesResponse, DownloadSharedFileRequest, DownloadSharedFileResponse, DownloadStorageFileRequest, DownloadStorageFileResponse, RoomUploadConfirmRequest, RoomUploadConfirmResponse, RoomUploadInitRequest, RoomUploadInitResponse, UpdateRoomFileRequest, UpdateRoomFileResponse, UploadSharedConfirmRequest, UploadSharedConfirmResponse, UploadSharedInitRequest, UploadSharedInitResponse, UploadStorageConfirmRequest, UploadStorageConfirmResponse, UploadStorageInitRequest, UploadStorageInitResponse } from "./types/file";

export const fileApi = createApi({
    reducerPath: "fileApi",
    baseQuery: baseQueryWithRefresh,
    endpoints: (build) => ({
        uploadRoomFile: build.mutation<RoomUploadInitResponse, RoomUploadInitRequest>({
            query: (body) => ({
                url: `/upload/auth/room/init`,
                method: "POST",
                body,
            }),
        }),
        uploadRoomConfirm: build.mutation<RoomUploadConfirmResponse, RoomUploadConfirmRequest>({
            query: (body) => ({
                url: `/upload/auth/room/confirm`,
                method: "POST",
                body,
            }),
        }),
        downloadRoomFiles: build.query<DownloadRoomFilesResponse[], DownloadRoomFilesRequest>({
            query: (body) => ({
                url: `/download/url-private/room`,
                method: "POST",
                body,
            }),
        }),
        deleteRoomFiles: build.mutation<DeleteRoomFilesResponse, DeleteRoomFilesRequest>({
            query: (body) => ({
                url: `/file`,
                method: "DELETE",
                body,
            }),
        }),
        updateRoomFile: build.mutation<UpdateRoomFileResponse, UpdateRoomFileRequest>({
            query: (body) => ({
                url: `/file/update`,
                method: "POST",
                body,
            }),
        }),
        uploadStorageInit: build.mutation<UploadStorageInitResponse, UploadStorageInitRequest>({
            query: (body) => ({
                url: `/upload/auth/storage/init`,
                method: "POST",
                body,
            }),
        }),
        uploadStorageConfirm: build.mutation<UploadStorageConfirmResponse, UploadStorageConfirmRequest>({
            query: (body) => ({
                url: `/upload/auth/storage/confirm`,
                method: "POST",
                body,
            }),
        }),
        downloadStorageFile: build.query<DownloadStorageFileResponse[], DownloadStorageFileRequest>({
            query: (body) => ({
                url: `/download/url-private/storage`,
                method: "POST",
                body,
            }),
        }),
        uploadSharedInit: build.mutation<UploadSharedInitResponse, UploadSharedInitRequest>({
            query: (body) => ({
                url: `/upload/auth/storage/init-shared`,
                method: "POST",
                body,
            }),
        }),
        uploadSharedConfirm: build.mutation<UploadSharedConfirmResponse, UploadSharedConfirmRequest>({
            query: (body) => ({
                url: `/upload/auth/storage/confirm-shared`,
                method: "POST",
                body,
            }),
        }),
        downloadSharedFile: build.query<DownloadSharedFileResponse[], DownloadSharedFileRequest>({
            query: (body) => ({
                url: `/download/url-private/shared`,
                method: "POST",
                body,
            }),
        }),
    }),
});

export const {
    useUploadRoomFileMutation,
    useUploadRoomConfirmMutation,
    useLazyDownloadRoomFilesQuery,
    useDeleteRoomFilesMutation,
    useUpdateRoomFileMutation,
    useUploadStorageInitMutation,
    useUploadStorageConfirmMutation,
    useLazyDownloadStorageFileQuery,
    useUploadSharedInitMutation,
    useUploadSharedConfirmMutation,
    useLazyDownloadSharedFileQuery,
} = fileApi;