export enum FileUploadStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETE = 'completed',
    FAILED = 'failed',
    CANCELED = 'canceled',
    STOPPED = 'stopped',
}

export interface FileItem {
    _id: string;
    originalName: string;
    key: string;
    size: number;
    mimeType: string;
    uploadTime: string;
    downloadCount: number;
    uploadedParts: number;
    expiresAt: string | null;
    creatorId: number;
    storedName: string;
    uploadSession: {
        status: FileUploadStatus;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface RoomUploadInitRequest {
  roomId: string;
  files: {
    originalName: string;
    fileSize: number;
    mimeType: string;
    uploaderIp: string;
  }[]
}

export interface RoomUploadInitResponse {
    success: boolean;
    result: {
        uploadId: string;
        uploadUrl: string;
    }[]
}

export interface RoomUploadConfirmRequest {
    roomId: string;
    uploadId: string;
}

export interface RoomUploadConfirmResponse {
    success: boolean;
    fileId: string;
}

export interface DownloadRoomFilesRequest {
    fileIds: string[];
    roomId: string;
}

export interface DownloadRoomFilesResponse {
    fileId: string;
    url: string;
}

export interface DeleteRoomFilesRequest {
    fileIds: string[];
    roomId: string;
}

export interface DeleteRoomFilesResponse {
    success: boolean;
}
