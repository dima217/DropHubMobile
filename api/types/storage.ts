import { AccessRole } from "./room";

export interface FileMeta {
    _id: string;
    originalName: string;
    storedName: string;
    size: number;
    mimeType: string;
    uploadTime: string;
    downloadCount: number;
    creatorId: number;
}

export interface CreateStorageResponse {
    success: boolean;
    storageId: string;
    storage: {
        id: string;
        tags: string[];
        createdAt: string;
        maxBytes: number;
    };
}

export interface GetStorageStructureRequest {
    storageId: string;
    parentId?: string;
}

export interface StorageItem {
    id: string;
    userId: string;
    name: string;
    storageId: string;
    isDirectory: boolean;
    parentId: string | null;
    fileId: string | null;
    creatorId: number;
    tags: string[];
    deletedAt: string | null;
    childrenCount?: number;
    filesCount?: number;
    foldersCount?: number;
    fileMeta?: FileMeta;
}

export interface StorageItemResponse {
    userId: string;
    name: string;
    storageId: string;
    isDirectory: boolean;
    parentId: string | null;
    fileId: string | null;
    creatorId: number;
    tags: string[];
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CreateStorageFolderRequest {
    storageId: string;
    name: string;
    parentId?: string;
    isDirectory: boolean;
}

export interface CreateStorageFolderResponse {
    success: boolean;
    item: StorageItemResponse;
}

export interface UpdateStorageItemRequest {
    storageId: string;
    itemId: string;
    newName: string;
}

export interface UpdateStorageItemResponse {
    id: string;
    userId: string;
    name: string;
    storageId: string;
    isDirectory: boolean;
    parentId: string | null;
    fileId: string | null;
    creatorId: number;
    tags: string[];
    deletedAt: string | null;
}

export interface MoveStorageItemRequest {
    storageId: string;
    itemId: string;
    newParentId: string;
}

export interface MoveStorageItemResponse {
    id: string;
    userId: string;
    name: string;
    storageId: string;
    isDirectory: boolean;
    parentId: string | null;
    fileId: string | null;
    creatorId: number;
    tags: string[];
    deletedAt: string | null;
}

export interface MoveStorageItemToTrashRequest {
    storageId: string;
    itemId: string;
}

export interface MoveStorageItemToTrashResponse {
    success: boolean;
    itemId: string;
}

export interface GetTrashItemsRequest {
    storageId: string;
}

export interface GetTrashItemsResponse {
    id: string;
    userId: string;
    name: string;
    storageId: string;
    isDirectory: boolean;
    parentId: string | null;
    fileId: string | null;
    creatorId: number;
    tags: string[];
    deletedAt: string | null;
}

export interface RestoreTrashItemRequest {
    storageId: string;
    itemId: string;
    newParentId?: string;
}

export interface RestoreTrashItemResponse {
    success: boolean;
    itemId: string;
}

export interface CopyStorageItemRequest {
    storageId: string;
    itemId: string;
    targetParentId?: string;
}

export interface CopyStorageItemResponse {
    id: string,
    userId: string,
    name: string,
    storageId: string,
    isDirectory: boolean,
    parentId: string | null,
    fileId: string | null,
    creatorId: number,
    tags: string[],
    deletedAt: string | null
}

export interface DeleteStorageItemRequest {
    storageId: string;
    itemId: string;
}

export interface DeleteStorageItemResponse {
    success: boolean;
    itemId: string;
}

export interface UpdateStorageItemTagsRequest {
    storageId: string;
    itemId: string;
    tags: string[];
}

export interface UpdateStorageItemTagsResponse {
    success: boolean;
    item: {
        id: string;
        userId: string;
        name: string;
        storageId: string;
        isDirectory: boolean;
        parentId: string | null;
        fileId: string | null;
        creatorId: number;
        tags: string[];
        deletedAt: string | null;
    };
}

export interface GetStorageInfoResponse {
    id: string;
    tags: string[];
    createdAt: string;
    maxBytes: number;
    userRole: AccessRole;
}

export interface RemoveStorageTagsRequest {
    storageId: string;
    tags: string[];
}

export interface RemoveStorageTagsResponse {
    success: boolean;
}

export interface ArchiveRoomToStorageRequest {
    roomId: string;
    storageId: string;
    fileIds: string[];
    parentId?: string;
    isDirectory?: boolean;
}

export interface ArchiveRoomToStorageResponse {
    success: boolean;
    roomId: string;
    folderId: string;
    archivedFilesCount: number;
}

