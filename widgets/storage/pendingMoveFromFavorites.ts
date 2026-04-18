import type { StorageItem } from "@/api/types/storage";

type Pending =
  | { kind: "single"; item: StorageItem }
  | { kind: "batch"; itemIds: string[] };

let pending: Pending | null = null;

export function stashMoveFromFavoritesSingle(item: StorageItem): void {
  pending = { kind: "single", item };
}

export function stashMoveFromFavoritesBatch(itemIds: string[]): void {
  pending = { kind: "batch", itemIds: [...itemIds] };
}

export function consumePendingMoveFromFavorites(): Pending | null {
  const p = pending;
  pending = null;
  return p;
}
