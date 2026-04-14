export type NotificationType =
  | "room_file"
  | "shared_grant"
  | "shared_upload"
  | "generic";

export interface AppNotification {
  id: number;
  userId: number;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

export interface GetNotificationsQuery {
  limit?: number;
  offset?: number;
}

export interface MarkNotificationsReadRequest {
  ids: number[];
}

export interface MarkNotificationsReadResponse {
  success: boolean;
}
