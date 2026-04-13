import { authApi } from "@/api/authApi";
import { store } from "@/store/store";

export async function syncFcmTokenToBackend(token: string | null): Promise<void> {
  await store
    .dispatch(authApi.endpoints.setFcmToken.initiate({ token }))
    .unwrap();
}
