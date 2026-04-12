import type { GoogleNativeAuthResponse } from "@/api/types/auth";
import { storageApi } from "@/api/storageApi";
import { API_BASE_URL } from "@/constants/apiConfig";
import { secureStore } from "@/services/secureStore";
import { setCredentials } from "@/store/slices/authSlice";
import type { AppDispatch } from "@/store/store";

export async function completeGoogleAuthSession(
  dispatch: AppDispatch,
  data: GoogleNativeAuthResponse,
  options?: { googleAccountEmail?: string | null }
): Promise<void> {
  const emailFromGoogle = options?.googleAccountEmail?.trim() || undefined;
  await secureStore.setAccessToken(data.accessToken);
  await secureStore.setRefreshToken(data.refreshToken);

  const profile = data.user?.profile;
  if (profile) {
    dispatch(
      setCredentials({
        accessToken: data.accessToken,
        user: {
          id: String(profile.id),
          email: emailFromGoogle,
          firstName: profile.firstName ?? undefined,
          avatarUrl: profile.avatarUrl ?? undefined,
        },
      })
    );
  } else {
    const res = await fetch(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
        "x-client-type": "mobile-app",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to load profile after Google sign-in");
    }

    const me = (await res.json()) as {
      id: string;
      email: string;
      name: string;
      avatar?: string | null;
    };

    dispatch(
      setCredentials({
        accessToken: data.accessToken,
        user: {
          id: String(me.id),
          email: emailFromGoogle ?? me.email,
          firstName: me.name,
          avatarUrl: me.avatar ?? undefined,
        },
      })
    );
  }

  if (data.existing === false) {
    await dispatch(storageApi.endpoints.createStorage.initiate()).unwrap();
  }
}
