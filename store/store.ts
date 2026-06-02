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
import { RESET_APP_STATE } from "@/store/constants";
import authReducer from "@/store/slices/authSlice";
import localizationReducer from "@/store/slices/localizationSlice";
import tagColorsReducer from "@/store/slices/tagColorsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore, UnknownAction } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const authResetState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
} as const;

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "tagColors", "localization"],
};

const appReducer = combineReducers({
  auth: authReducer,
  localization: localizationReducer,
  tagColors: tagColorsReducer,
  [authApi.reducerPath]: authApi.reducer,
  [avatarApi.reducerPath]: avatarApi.reducer,
  [chatChannelsApi.reducerPath]: chatChannelsApi.reducer,
  [friendApi.reducerPath]: friendApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [sharedApi.reducerPath]: sharedApi.reducer,
  [favoritesApi.reducerPath]: favoritesApi.reducer,
  [storageApi.reducerPath]: storageApi.reducer,
  [supportApi.reducerPath]: supportApi.reducer,
  [notificationsApi.reducerPath]: notificationsApi.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: UnknownAction
) => {
  if (action.type === RESET_APP_STATE) {
    const localization = state?.localization;
    const freshState = appReducer(undefined, { type: "@@INIT" });
    return {
      ...freshState,
      localization: localization ?? freshState.localization,
      auth: authResetState,
    };
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authApi.middleware)
      .concat(avatarApi.middleware)
      .concat(chatChannelsApi.middleware)
      .concat(friendApi.middleware)
      .concat(fileApi.middleware)
      .concat(roomApi.middleware)
      .concat(searchApi.middleware)
      .concat(sharedApi.middleware)
      .concat(favoritesApi.middleware)
      .concat(storageApi.middleware)
      .concat(supportApi.middleware)
      .concat(notificationsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
