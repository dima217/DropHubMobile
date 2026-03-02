import { AccessRole } from "./room";
import { StorageItem } from "./storage";

export enum ResourceType {
    STORAGE = "storage",
    SHARED = "shared",
}

export interface GrantPermissionsRequest {
    storageId: string;
    resourceId: string;
    //storage type
    resourceType: ResourceType;
    targetUserId: number;
    role: AccessRole;
}

export interface GrantPermissionsResponse {
    id: string;
    resourceId: string;
    //shared type
    resourceType: ResourceType;
    role: AccessRole;
    user?: {
        id: number;
    }
}

export interface GetSharedResourcesResponse extends StorageItem {
    userRole: AccessRole;
    creator?: {
        id: number;
        email: string;
        profile: {
            id: number;
            firstName: string;
            avatarUrl: string;
        };
    };
}

export interface RevokePermissionsRequest {
    storageId: string;
    resourceId: string;
    resourceType: ResourceType;
    targetUserId: number;
    role: AccessRole;
}

export interface GetSharedStructureRequest {
    storageId: string;
    resourceId: string;
    parentId?: string;
}

export interface GetSharedItemParticipantsRequest {
    itemId: string;
}

export interface GetSharedItemParticipantResponse {
    userId: number;
    role: AccessRole;
    email: string;
    profile: {
        firstName: string;
        avatarUrl: string;
    };
}

export interface CreateSharedItemRequest {
    resourceId: string;
    storageId: string;
    name: string;
    parentId: string;
    isDirectory: boolean;
}

export interface CreateSharedItemResponse {
    userId: number;
    name: string;
    storageId: string;
    isDirectory: boolean;
    parentId: string;
    fileId: string | null;
    creatorId: number;
    tags: string[];
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
}