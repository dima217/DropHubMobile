import type { AppNotification, NotificationType } from "@/api/types/notification";
import { translate } from "@/shared/localization";
import type { AppLanguage } from "@/store/slices/localizationSlice";

const NOTIFICATION_BODY_KEYS: Record<NotificationType, Parameters<typeof translate>[1]> = {
  generic: "notifications.generic.body",
  room_file: "notifications.room_file.body",
  shared_grant: "notifications.shared_grant.body",
  shared_upload: "notifications.shared_upload.body",
};

export function resolveActorName(
  language: AppLanguage,
  name?: string | null
): string {
  const trimmed = name?.trim();
  if (trimmed) return trimmed;
  return translate(language, "notifications.actor.default");
}

export function buildNotificationContent(
  language: AppLanguage,
  type: NotificationType,
  params: Record<string, string> = {}
): { title: string; body: string } {
  const actorName = resolveActorName(
    language,
    params.actorName ?? params.actor_name
  );
  const bodyKey =
    NOTIFICATION_BODY_KEYS[type] ?? NOTIFICATION_BODY_KEYS.generic;

  return {
    title: translate(language, "notifications.title"),
    body: translate(language, bodyKey, { ...params, actorName }),
  };
}

export function localizeNotification(
  language: AppLanguage,
  notification: Pick<AppNotification, "type" | "data">
): { title: string; body: string } {
  return buildNotificationContent(
    language,
    notification.type,
    notification.data ?? {}
  );
}
