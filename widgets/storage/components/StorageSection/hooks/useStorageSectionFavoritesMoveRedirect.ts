import { StorageItem } from "@/api/types/storage";
import { useRouter } from "expo-router";
import { useCallback } from "react";
import { stashMoveFromFavoritesSingle } from "../../../pendingMoveFromFavorites";
import type { ResolvedStorageSectionOptions } from "../types";

type Actions = ReturnType<
  typeof import("../../../hooks/useStorageActions").useStorageActions
>;

export function useStorageSectionFavoritesMoveRedirect(params: {
  isFavoritesVirtualRoot: boolean;
  options: ResolvedStorageSectionOptions;
  actions: Actions;
}) {
  const { isFavoritesVirtualRoot, options, actions } = params;
  const router = useRouter();

  return useCallback(
    (item: StorageItem) => {
      if (isFavoritesVirtualRoot && options.redirectMoveToStorageTab) {
        stashMoveFromFavoritesSingle(item);
        router.push("/(tabs)/storage");
        return;
      }
      actions.handleMove(item);
    },
    [isFavoritesVirtualRoot, options.redirectMoveToStorageTab, actions.handleMove, router]
  );
}
