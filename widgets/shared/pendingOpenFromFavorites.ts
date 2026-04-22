import type { StorageItem } from "@/api/types/storage";

let pendingOpenFromFavorites: StorageItem | null = null;

export const stashPendingOpenFromFavorites = (item: StorageItem) => {
  pendingOpenFromFavorites = item;
};

export const consumePendingOpenFromFavorites = (): StorageItem | null => {
  const value = pendingOpenFromFavorites;
  pendingOpenFromFavorites = null;
  return value;
};
