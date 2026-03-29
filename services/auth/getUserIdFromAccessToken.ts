import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

/** Claims we try, in order, for the DropHub access token. */
type DropHubAccessTokenPayload = JwtPayload & {
  userId?: string | number;
  user_id?: string | number;
  id?: string | number;
};

/**
 * Returns the authenticated user id as a string, or null if the token is missing/invalid.
 */
export function getUserIdFromAccessToken(
  token: string | null | undefined
): string | null {
  if (!token) return null;
  try {
    const decoded = jwtDecode<DropHubAccessTokenPayload>(token);
    if (decoded.sub) return String(decoded.sub);
    if (decoded.userId != null) return String(decoded.userId);
    if (decoded.user_id != null) return String(decoded.user_id);
    if (decoded.id != null) return String(decoded.id);
    return null;
  } catch {
    return null;
  }
}
