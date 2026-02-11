import { ResourceType } from "./shared";
import { StorageItem } from "./storage";

export interface FavoriteItem extends StorageItem {
    resourceType: ResourceType;
}

export interface GetFavoritesResponse {
    success: boolean;
    items: FavoriteItem[];
}

export interface AddFavoriteFromStorageRequest {
    storageId: string;
    itemId: string;
}

export interface AddFavoriteFromStorageResponse {
    id: string;
    userId: number;
    storageId: string;
    resourceType: ResourceType;
    itemId: string;
    createdAt: string;
}

export interface AddFavoriteFromSharedRequest {
    storageId: string;
    itemId: string;
}

export interface AddFavoriteFromSharedResponse {
    id: string;
    userId: number;
    storageId: string;
    resourceType: ResourceType;
    itemId: string;
    createdAt: string;
}

export interface RemoveFavoriteFromStorageRequest {
    storageId: string;
    itemId: string;
}

export interface RemoveFavoriteFromStorageResponse {
    success: boolean;
}

export interface RemoveFavoriteFromSharedRequest {
    storageId: string;
    itemId: string;
}

export interface RemoveFavoriteFromSharedResponse {
    success: boolean;
}