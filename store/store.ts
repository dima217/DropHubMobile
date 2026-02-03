import { authApi } from "@/api/authApi";
import { avatarApi } from "@/api/avatarApi";
import { chatApi } from "@/api/chatApi";
import { fileApi } from "@/api/fileApi";
import { friendApi } from "@/api/friendApi";
import { roomApi } from "@/api/roomApi";
import authReducer from "@/store/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  [authApi.reducerPath]: authApi.reducer,
  [avatarApi.reducerPath]: avatarApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [friendApi.reducerPath]: friendApi.reducer,
  [fileApi.reducerPath]: fileApi.reducer,
  [roomApi.reducerPath]: roomApi.reducer,
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
      .concat(chatApi.middleware)
      .concat(friendApi.middleware)
      .concat(fileApi.middleware)
      .concat(roomApi.middleware)
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
