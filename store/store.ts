import { authApi } from "@/api/authApi";
import { avatarApi } from "@/api/avatarApi";
import { chatChannelsApi } from "@/api/chatChannelsApi";
import { fileApi } from "@/api/fileApi";
import { friendApi } from "@/api/friendApi";
import { roomApi } from "@/api/roomApi";
import { searchApi } from "@/api/searchApi";
import { sharedApi } from "@/api/sharedApi";
import { favoritesApi } from "@/api/favorites";
import { storageApi } from "@/api/storageApi";
import authReducer from "@/store/slices/authSlice";
import tagColorsReducer from "@/store/slices/tagColorsSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "tagColors"],
};

const rootReducer = combineReducers({
  auth: authReducer,
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
});

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
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
