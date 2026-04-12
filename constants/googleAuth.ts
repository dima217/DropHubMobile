import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra as
  | {
      googleWebClientId?: string;
      googleIosClientId?: string;
    }
  | undefined;

/** OAuth 2.0 Web client ID (Android + server verification). Required for `idToken` on Android. */
export const GOOGLE_WEB_CLIENT_ID = extra?.googleWebClientId?.trim() ?? "";

/** iOS OAuth client ID (optional if using GoogleService-Info.plist). */
export const GOOGLE_IOS_CLIENT_ID = extra?.googleIosClientId?.trim() ?? "";
