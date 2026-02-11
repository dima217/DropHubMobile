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

export interface UpdateRoomFileRequest {
    fileId: string;
    roomId: string;
    storedName: string;
}

export interface UpdateRoomFileResponse {
    success: boolean;
    roomId: string;
}

export interface UploadStorageInitRequest {
    storageId: string;
    files: {
        originalName: string;
        fileSize: number;
        mimeType: string;
        uploaderIp: string;
    }[];
}

export interface UploadStorageInitResponse {
    success: boolean;
    result: {
        uploadId: string;
        uploadUrl: string;
    }[];
}

export interface UploadStorageConfirmRequest {
    uploadId: string;
    storageId: string;
    parentId?: string;
}

export interface UploadStorageConfirmResponse {
    success: boolean;
    fileId: string;
}

export interface DownloadStorageFileRequest {
    fileIds: string[];
    storageId: string;
}

export interface DownloadStorageFileResponse {
    fileId: string;
    url: string;
}

export interface UploadSharedInitRequest {
    sharedId: string;
    files: {
        originalName: string;
        fileSize: number;
        mimeType: string;
        uploaderIp: string;
    }[];
}

export interface UploadSharedInitResponse { 
    success: boolean;
    result: {
        uploadId: string;
        uploadUrl: string;
    }[];
}

export interface UploadSharedConfirmRequest {
    uploadId: string;
    sharedId: string;
    resourceId: string;
    parentId: string;
}

export interface UploadSharedConfirmResponse {
    success: boolean;
    fileId: string;  
}

export interface DownloadSharedFileRequest {
    fileIds: string[];
    sharedId: string;
}

export interface DownloadSharedFileResponse {
    fileId: string;
    url: string;
}
