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
    resourceId?: string;
    parentId?: string;
}

export interface StorageSharedWithUser {
    userId: number;
    role: AccessRole;
    email: string | null;
    profile: {
        firstName: string;
        avatarUrl: string | null;
    } | null;
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
    /** File-only size shortcut returned by some endpoints (e.g. trash list). */
    size?: number;
    /** File-only download counter shortcut returned by structure endpoints. */
    downloadCount?: number;
    sharedWith?: StorageSharedWithUser[];
}

export interface StorageItemResponse {
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
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface CreateStorageFolderRequest {
    storageId: string;
    resourceId?: string;
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
    resourceId?: string;
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
    resourceId?: string;
    itemId: string;
    newParentId: string | null;
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
    resourceId?: string;
    itemId: string;
}

export interface MoveStorageItemToTrashResponse {
    success: boolean;
    itemId: string;
}

export interface GetTrashItemsRequest {
    storageId: string;
    resourceId?: string;
}

export interface GetTrashItemsResponse {
    id: string;
    userId: string;
    name: string;
    storageId: string;
    isDirectory: boolean;
    parentId: string | null;
    fileId: string | null;
    /** File-only size shortcut (bytes). */
    size?: number;
    creatorId: number;
    tags: string[];
    deletedAt: string | null;
}

export interface RestoreTrashItemRequest {
    storageId: string;
    resourceId?: string;
    itemId: string;
    newParentId?: string;
}

export interface RestoreTrashItemResponse {
    success: boolean;
    itemId: string;
}

export interface CopyStorageItemRequest {
    storageId: string;
    resourceId?: string;
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
    resourceId?: string;
    itemId: string;
}

export interface DeleteStorageItemResponse {
    success: boolean;
    itemId: string;
}

export interface UpdateStorageItemTagsRequest {
    storageId: string;
    resourceId?: string;
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
    /** Суммарный размер всех не удалённых файлов в storage (байты). */
    usedBytes?: number;
    userRole: AccessRole;
}

/** Ответ GET /storage — квота и занятость (см. документацию API). */
export type UserStorageQuotaInfo = GetStorageInfoResponse;

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

/** Результат по одному элементу в batch-операциях storage */
export interface StorageBatchResultRow {
    itemId: string;
    success: boolean;
    item?: StorageItem;
    error?: string;
}

export interface StorageBatchResponse {
    total: number;
    succeeded: number;
    failed: number;
    results: StorageBatchResultRow[];
}

export interface StorageBatchBaseBody {
    storageId: string;
    itemIds: string[];
    resourceId?: string;
}

export interface BatchMoveStorageItemsRequest extends StorageBatchBaseBody {
    newParentId: string | null;
}

export interface BatchCopyStorageItemsRequest extends StorageBatchBaseBody {
    targetParentId: string | null;
}

export type BatchSoftDeleteStorageItemsRequest = StorageBatchBaseBody;

export interface BatchRestoreStorageItemsRequest extends StorageBatchBaseBody {
    newParentId?: string | null;
}

export type BatchPermanentDeleteStorageItemsRequest = StorageBatchBaseBody;

export interface BatchUpdateStorageItemTagsRequest extends StorageBatchBaseBody {
    tags: string[];
}

