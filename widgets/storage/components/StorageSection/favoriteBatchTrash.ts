import { favoritesApi } from "@/api/favorites";
import type { FavoriteItem } from "@/api/types/favorites";
import type { StorageBatchResponse } from "@/api/types/storage";
import { ResourceType } from "@/api/types/shared";
import type { AppDispatch } from "@/store/store";
import { showStorageBatchResultAlert } from "@/widgets/storage/utils/storageBatchAlert";
import { Alert } from "react-native";

/**
 * Избранное: STORAGE — batch soft delete; SHARED — по одному delete-item.
 */
export async function runFavoritesSelectionToTrash(params: {
  storageId: string;
  ids: string[];
  favoritesItems: FavoriteItem[];
  deleteStorageBatch: (itemIds: string[]) => Promise<StorageBatchResponse>;
  deleteSharedOne: (itemId: string) => Promise<unknown>;
  dispatch: AppDispatch;
  tl?: (s: string) => string;
}): Promise<void> {
  const {
    storageId,
    ids,
    favoritesItems,
    deleteStorageBatch,
    deleteSharedOne,
    dispatch,
    tl = (s: string) => s,
  } = params;

  const storageIds: string[] = [];
  const sharedIds: string[] = [];
  for (const id of ids) {
    const fav = favoritesItems.find((f) => f.id === id) as FavoriteItem | undefined;
    if (fav?.resourceType === ResourceType.SHARED) {
      sharedIds.push(id);
    } else {
      storageIds.push(id);
    }
  }
  if (storageIds.length > 0) {
    const result = await deleteStorageBatch(storageIds);
    showStorageBatchResultAlert(result, tl("В корзину"), tl);
  }
  for (const itemId of sharedIds) {
    await deleteSharedOne(itemId);
  }
  if (sharedIds.length > 0 && storageIds.length === 0) {
    Alert.alert(tl("Готово"), `${tl("В корзину")}: ${sharedIds.length} ${tl("эл.")}`);
  }
  dispatch(favoritesApi.util.invalidateTags(["Favorites"]));
}
