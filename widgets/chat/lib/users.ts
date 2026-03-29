export interface KnownUser {
  id: string;
  email: string;
  name: string;
}

/** Wire room/friends API when using channel modals; empty in room-only flow. */
export const USERS: KnownUser[] = [];

/** Fallback label when `Message.sender_display_name` is not set (e.g. legacy channel IDs). */
export function getUserName(senderId: string): string {
  const known = USERS.find((u) => u.id === senderId);
  if (known) return known.name;
  if (senderId === "system") return "System";
  if (!senderId) return "…";
  return senderId.length > 10 ? `${senderId.slice(0, 10)}…` : senderId;
}
