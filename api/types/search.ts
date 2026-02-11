import { FileItem } from "./file";
import { StorageItem } from "./storage";

export enum SearchResourceType {
    ROOM = 'room',
    STORAGE = 'storage',
    ALL = 'all',
}

export interface SearchRequest {
    query: string;
    resourceType: SearchResourceType;
    tags?: string[];
    mimeType?: string;
    creatorId?: number;
}
export interface SearchResponse {
    success: boolean;
    total: number;
    files: FileItem[];
    storageItems: StorageItem[];
}