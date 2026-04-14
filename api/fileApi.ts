import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "./baseApi";
import { roomApi } from "./roomApi";
import { storageApi } from "./storageApi";
import { DeleteRoomFilesRequest, DeleteRoomFilesResponse, DownloadRoomFilesRequest, DownloadRoomFilesResponse, DownloadSharedFileRequest, DownloadSharedFileResponse, DownloadStorageFileRequest, DownloadStorageFileResponse, ConvertFileResponse, ConvertRoomFileRequest, ConvertStorageFileRequest, FileUploadStatus, RoomUploadConfirmRequest, RoomUploadConfirmResponse, RoomUploadInitRequest, RoomUploadInitResponse, UpdateRoomFileRequest, UpdateRoomFileResponse, UploadSharedConfirmRequest, UploadSharedConfirmResponse, UploadSharedInitRequest, UploadSharedInitResponse, UploadStorageConfirmRequest, UploadStorageConfirmResponse, UploadStorageInitRequest, UploadStorageInitResponse } from "./types/file";

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
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(storageApi.util.invalidateTags(["StorageInfo"]));
                } catch {
                    /* ошибку показывает вызывающий код */
                }
            },
        }),
        downloadStorageFile: build.query<DownloadStorageFileResponse[], DownloadStorageFileRequest>({
            query: (body) => ({
                url: `/download/url-private/storage`,
                method: "POST",
                body,
            }),
            keepUnusedDataFor: 0,
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
            async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(storageApi.util.invalidateTags(["StorageInfo"]));
                } catch {
                    /* см. вызывающий код */
                }
            },
        }),
        downloadSharedFile: build.query<DownloadSharedFileResponse[], DownloadSharedFileRequest>({
            query: (body) => ({
                url: `/download/url-private/shared`,
                method: "POST",
                body,
            }),
        }),
        convertRoomFile: build.mutation<ConvertFileResponse, ConvertRoomFileRequest>({
            query: (body) => ({
                url: `/file/convert-room`,
                method: "POST",
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const now = new Date().toISOString();
                    dispatch(
                        roomApi.util.updateQueryData("getRoomDetails", arg.roomId, (draft) => {
                            if (!draft.files) draft.files = [];
                            for (const f of data.createdFiles) {
                                draft.files.push({
                                    _id: f.fileId,
                                    storedName: f.fileName,
                                    originalName: f.fileName,
                                    mimeType: f.mimeType,
                                    size: f.size,
                                    key: "",
                                    uploadTime: now,
                                    downloadCount: 0,
                                    uploadedParts: 0,
                                    expiresAt: null,
                                    creatorId: 0,
                                    uploadSession: { status: FileUploadStatus.COMPLETE },
                                    createdAt: now,
                                    updatedAt: now,
                                    __v: 0,
                                });
                            }
                        })
                    );
                } catch {
                    /* handled by caller */
                }
            },
        }),
        convertStorageFile: build.mutation<ConvertFileResponse, ConvertStorageFileRequest>({
            query: (body) => ({
                url: `/file/convert-storage`,
                method: "POST",
                body,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(
                        storageApi.util.invalidateTags([{ type: "Storage", id: arg.storageId }])
                    );
                } catch {
                    /* handled by caller */
                }
            },
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
    useConvertRoomFileMutation,
    useConvertStorageFileMutation,
} = fileApi;