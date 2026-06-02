import { authApi } from "@/api/authApi";
import { avatarApi } from "@/api/avatarApi";
import { chatChannelsApi } from "@/api/chatChannelsApi";
import { fileApi } from "@/api/fileApi";
import { friendApi } from "@/api/friendApi";
import { notificationsApi } from "@/api/notificationsApi";
import { roomApi } from "@/api/roomApi";
import { searchApi } from "@/api/searchApi";
import { sharedApi } from "@/api/sharedApi";
import { favoritesApi } from "@/api/favorites";
import { storageApi } from "@/api/storageApi";
import { supportApi } from "@/api/supportApi";
import { secureStore } from "@/services/secureStore";
import { chatWs } from "@/widgets/chat/lib/websocket";
import { RESET_APP_STATE } from "./constants";
import { persistor, store } from "./store";

const rtkApis = [
  authApi,
  avatarApi,
  chatChannelsApi,
  friendApi,
  fileApi,
  roomApi,
  searchApi,
  sharedApi,
  favoritesApi,
  storageApi,
  supportApi,
  notificationsApi,
] as const;

/** Clears cached API data and user-specific slices; keeps language settings. */
export async function resetAppState(): Promise<void> {
  for (const api of rtkApis) {
    store.dispatch(api.util.resetApiState());
  }
  chatWs.disconnect();
  store.dispatch({ type: RESET_APP_STATE });
  await secureStore.clearAll();
  void persistor.flush();
}
