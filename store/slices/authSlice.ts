import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: true,
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user: User | null;
        accessToken: string | null;
      }>
    ) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
    },
    setAuth(state, action: PayloadAction<string | null>) {
      state.isAuthenticated = !!action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setAccessToken(
      state,
      action: PayloadAction<{
        accessToken: string | null;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
  },
});

export const {
  setCredentials,
  setAuth,
  setAccessToken,
  setUser,
  clearAuth,
  setLoading,
} = slice.actions;
export default slice.reducer;
