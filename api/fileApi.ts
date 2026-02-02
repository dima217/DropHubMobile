import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { DeleteRoomFilesRequest, DeleteRoomFilesResponse, DownloadRoomFilesRequest, DownloadRoomFilesResponse, RoomUploadConfirmRequest, RoomUploadConfirmResponse, RoomUploadInitRequest, RoomUploadInitResponse } from "./types/file";

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
    }),
});

export const {
    useUploadRoomFileMutation,
    useUploadRoomConfirmMutation,
    useLazyDownloadRoomFilesQuery,
    useDeleteRoomFilesMutation,
} = fileApi;