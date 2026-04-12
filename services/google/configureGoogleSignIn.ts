import { GOOGLE_WEB_CLIENT_ID } from "@/constants/googleAuth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

let configured = false;

export function ensureGoogleSignInConfigured(): void {
  if (configured) return;
  console.log("GOOGLE_WEB_CLIENT_ID", GOOGLE_WEB_CLIENT_ID);
  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error(
      "Missing expo.extra.googleWebClientId — set it in app.json (OAuth Web client ID from Google Cloud)."
    );
  }
  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });
  configured = true;
}
