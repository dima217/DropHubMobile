import { StorageItem } from "./storage";

export enum SearchResourceType {
    ROOM = 'room',
    STORAGE = 'storage',
    ALL = 'all',
}

export interface SearchFile {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    creatorId: number;
    resourceId: string;
    resourceType: SearchResourceType;
}

export interface SearchRequest {
    query: string;
    resourceType: SearchResourceType;
    tags?: string[];
    mimeType?: string;
    mimeTypes?: string[];
    creatorId?: number;
}
export interface SearchResponse {
    success: boolean;
    total: number;
    files: SearchFile[];
    storageItems: StorageItem[];
}