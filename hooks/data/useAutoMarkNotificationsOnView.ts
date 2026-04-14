import { useGetNotificationsQuery, useMarkNotificationsReadMutation } from "@/api";
import { PushNotificationDataType } from "@/constants/pushNotifications";
import { useEffect, useRef } from "react";

const LIST_PARAMS = { limit: 100, offset: 0 } as const;

function normalizeRouteParam(
  value: string | string[] | undefined
): string | undefined {
  if (typeof value === "string" && value.length > 0) return value;
  if (Array.isArray(value) && typeof value[0] === "string" && value[0].length > 0) {
    return value[0];
  }
  return undefined;
}

export function useAutoMarkRoomFileNotificationsRead(
  roomId: string | string[] | undefined
): void {
  const normalizedRoomId = normalizeRouteParam(roomId);
  const { data } = useGetNotificationsQuery(LIST_PARAMS, { skip: !normalizedRoomId });
  const [markRead] = useMarkNotificationsReadMutation();
  const submittedKeyRef = useRef<string>("");

  useEffect(() => {
    if (!normalizedRoomId || data == null) return;

    const ids = data
      .filter(
        (n) =>
          !n.isRead &&
          n.type === PushNotificationDataType.ROOM_FILE &&
          n.data.roomId === normalizedRoomId
      )
      .map((n) => n.id);

    if (ids.length === 0) {
      submittedKeyRef.current = "";
      return;
    }

    const key = `${normalizedRoomId}:${ids.slice().sort((a, b) => a - b).join(",")}`;
    if (submittedKeyRef.current === key) return;
    submittedKeyRef.current = key;

    void markRead({ ids })
      .unwrap()
      .catch(() => {
        if (submittedKeyRef.current === key) submittedKeyRef.current = "";
      });
  }, [normalizedRoomId, data, markRead]);
}

export function useAutoMarkSharedNotificationsRead(): void {
  const { data } = useGetNotificationsQuery(LIST_PARAMS);
  const [markRead] = useMarkNotificationsReadMutation();
  const submittedKeyRef = useRef<string>("");

  useEffect(() => {
    if (data == null) return;

    const ids = data
      .filter(
        (n) =>
          !n.isRead &&
          (n.type === PushNotificationDataType.SHARED_GRANT ||
            n.type === PushNotificationDataType.SHARED_UPLOAD)
      )
      .map((n) => n.id);

    if (ids.length === 0) {
      submittedKeyRef.current = "";
      return;
    }

    const key = `shared:${ids.slice().sort((a, b) => a - b).join(",")}`;
    if (submittedKeyRef.current === key) return;
    submittedKeyRef.current = key;

    void markRead({ ids })
      .unwrap()
      .catch(() => {
        if (submittedKeyRef.current === key) submittedKeyRef.current = "";
      });
  }, [data, markRead]);
}
