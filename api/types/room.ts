export enum FileUploadStatus {
    IN_PROGRESS = 'in_progress',
    COMPLETE = 'completed',
    FAILED = 'failed',
    CANCELED = 'canceled',
    STOPPED = 'stopped',
}

export enum AccessRole {
    ADMIN = 'admin',
    WRITE = 'write',
    READ = 'read',
}

export interface CreateRoomRequest {
    username: string;
    expiresAt?: string;
}

export interface CreateRoomResponse {
    success: boolean;
    roomId: string;
}

export interface Room {
    success: boolean;
    rooms: RoomItem[];  
}

export interface RoomItem {
    id: string;
    files: string[];
    groups: string[];
    createdAt: string;
    participants: number;
    owner: string;
    expiresAt: string | null;
    maxBytes: number;
    uploadSession: {
        status: FileUploadStatus;
    };
    userRole: AccessRole;
    participantsDetails: {
        userId: number;
        role: AccessRole;
        email: string;
        profile: {
            firstName: string;
            avatarUrl: string;
        };
    }[];
}

export interface RoomDetails {
    id: string;
    files: string[];
    groups: string[];
    createdAt: string;
    participants: number;
    owner: string;
    expiresAt: string | null;
    maxBytes: number;
    uploadSession: {
        status: FileUploadStatus;
    };
    participantsDetails: {
        userId: number;
        role: AccessRole;
        email: string;
        profile: {
            firstName: string;
            avatarUrl: string;
        };
    }[];
}

export interface AddUserToRoomRequest {
    roomId: string;
    targetUserIds: number[];
    role: AccessRole;
}

export interface AddUserToRoomResponse {
    success: boolean;
    message: string;
    successful: number[];
    failed: number[];
}

export interface RemoveUsersFromRoomRequest {
    roomId: string;
    targetUserIds: number[];
}

export interface RemoveUsersFromRoomResponse {
    success: boolean;
    message: string;
    successful: number[];
    failed: number[];
}   

export interface DeleteRoomRequest {
    roomId: string;
}

export interface DeleteRoomResponse {
    success: boolean;
    message: string;
}