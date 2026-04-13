/** Android notification channel (align with FCM `android.channel_id` if server sends it). */
export const ANDROID_NOTIFICATION_CHANNEL_ID = "default";

/** Payload `data.type` from DropHub FCM (all values are strings). */
export const PushNotificationDataType = {
  ROOM_FILE: "room_file",
  SHARED_GRANT: "shared_grant",
  SHARED_UPLOAD: "shared_upload",
} as const;
