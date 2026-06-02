import Constants from "expo-constants";

/** Default backend origin when `expo.extra.apiBaseUrl` is not set. */
const DEFAULT_API_BASE_URL = "https://app-production-7138.up.railway.app";

function normalizeOrigin(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

function resolveApiBaseUrl(): string {
  const fromExpo = Constants.expoConfig?.extra?.apiBaseUrl;
  if (typeof fromExpo === "string" && fromExpo.trim()) {
    return normalizeOrigin(fromExpo);
  }
  return DEFAULT_API_BASE_URL;
}

/** HTTP API base URL (RTK Query, fetch). */
export const API_BASE_URL = resolveApiBaseUrl();

/** Socket.IO / WebSocket origin (same host as `API_BASE_URL`). */
export const API_ORIGIN = API_BASE_URL;
