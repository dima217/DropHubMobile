import {
  ANDROID_NOTIFICATION_CHANNEL_ID,
  PushNotificationDataType,
} from "@/constants/pushNotifications";
import { getNativeFcmToken } from "@/services/push/getNativeFcmToken";
import { syncFcmTokenToBackend } from "@/services/push/syncFcmTokenToBackend";
import type { RootState } from "@/store/store";
import { store } from "@/store/store";
import * as Notifications from "expo-notifications";
import { Href, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { AppState, Platform } from "react-native";
import { useSelector } from "react-redux";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

let coldStartNotificationHandled = false;

function navigateFromPushData(
  router: ReturnType<typeof useRouter>,
  data: Record<string, unknown> | undefined
) {
  if (!data || typeof data !== "object") return;
  const type = data.type;
  const roomId = data.roomId;
  if (
    type === PushNotificationDataType.ROOM_FILE &&
    typeof roomId === "string" &&
    roomId.length > 0
  ) {
    router.push(`/(tabs)/rooms/${roomId}`);
    return;
  }
  if (
    type === PushNotificationDataType.SHARED_GRANT ||
    type === PushNotificationDataType.SHARED_UPLOAD
  ) {
    router.push("/(tabs)/shared" as Href);
  }
}

export function PushNotificationsController() {
  const router = useRouter();
  const isAuthenticated = useSelector(
    (s: RootState) => s.auth.isAuthenticated && !!s.auth.accessToken
  );
  const lastSyncedToken = useRef<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      lastSyncedToken.current = null;
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    void (async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync(
          ANDROID_NOTIFICATION_CHANNEL_ID,
          {
            name: "DropHub",
            importance: Notifications.AndroidImportance.DEFAULT,
          }
        );
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === "web" || !isAuthenticated) return;

    let cancelled = false;

    const register = async () => {
      try {
        const token = await getNativeFcmToken();
        if (cancelled || token == null) return;
        if (token === lastSyncedToken.current) return;
        await syncFcmTokenToBackend(token);
        lastSyncedToken.current = token;
        console.log("FCM token registered", token);
      } catch (e) {
        console.warn("[FCM] register failed", e);
      }
    };

    register();

    const sub = Notifications.addPushTokenListener((device) => {
      if (device.type !== "android" || typeof device.data !== "string") return;
      void (async () => {
        try {
          const { auth } = store.getState();
          if (!auth.isAuthenticated || !auth.accessToken) return;
          await syncFcmTokenToBackend(device.data);
          lastSyncedToken.current = device.data;
        } catch (e) {
          console.warn("[FCM] token refresh sync failed", e);
        }
      })();
    });

    const appSub = AppState.addEventListener("change", (next) => {
      if (next === "active") void register();
    });

    return () => {
      cancelled = true;
      sub.remove();
      appSub.remove();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (Platform.OS === "web") return;

    const opened = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const raw = response.notification.request.content.data;
        navigateFromPushData(router, raw as Record<string, unknown>);
      }
    );

    if (!coldStartNotificationHandled) {
      coldStartNotificationHandled = true;
      const last = Notifications.getLastNotificationResponse();
      if (!last) return;
      const raw = last.notification.request.content.data;
      navigateFromPushData(router, raw as Record<string, unknown>);
    }

    return () => opened.remove();
  }, [router]);

  return null;
}
