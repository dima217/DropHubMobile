import * as SecureStore from "expo-secure-store";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";
const ANON_SUPPORT_KEY = "support_anonymous";

export type AnonymousSupportCredentials = { id: string; token: string };

export const secureStore = {
  async getAccessToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(ACCESS_KEY);
    } catch (e) {
      console.warn("secureStore.getAccessToken error", e);
      return null;
    }
  },

  async setAccessToken(token: string | null) {
    try {
      if (token == null) await SecureStore.deleteItemAsync(ACCESS_KEY);
      else
        await SecureStore.setItemAsync(ACCESS_KEY, token, {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
        });
    } catch (e) {
      console.warn("secureStore.setAccessToken error", e);
    }
  },

  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_KEY);
    } catch (e) {
      console.warn("secureStore.getRefreshToken error", e);
      return null;
    }
  },

  async setRefreshToken(token: string | null) {
    try {
      if (token == null) await SecureStore.deleteItemAsync(REFRESH_KEY);
      else
        await SecureStore.setItemAsync(REFRESH_KEY, token, {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
        });
    } catch (e) {
      console.warn("secureStore.setRefreshToken error", e);
    }
  },

  async clearAll() {
    try {
      await SecureStore.deleteItemAsync(ACCESS_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
    } catch (e) {
      console.warn("secureStore.clearAll error", e);
    }
  },

  async getAnonymousSupportCredentials(): Promise<AnonymousSupportCredentials | null> {
    try {
      const raw = await SecureStore.getItemAsync(ANON_SUPPORT_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AnonymousSupportCredentials;
      if (parsed?.id && parsed?.token) return parsed;
      return null;
    } catch (e) {
      console.warn("secureStore.getAnonymousSupportCredentials error", e);
      return null;
    }
  },

  async setAnonymousSupportCredentials(creds: AnonymousSupportCredentials | null) {
    try {
      if (creds == null) {
        await SecureStore.deleteItemAsync(ANON_SUPPORT_KEY);
      } else {
        await SecureStore.setItemAsync(ANON_SUPPORT_KEY, JSON.stringify(creds), {
          keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
        });
      }
    } catch (e) {
      console.warn("secureStore.setAnonymousSupportCredentials error", e);
    }
  },
};
