import type { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

export const shouldRefreshToken = (
  token: string | null,
  remainingMinutes: number = 1
): boolean => {
  try {
    if (!token) return true;

    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;
    const remainingSeconds = remainingMinutes * 60;

    if (expirationTime <= currentTime) {
      return true;
    }

    return expirationTime - currentTime <= remainingSeconds;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};
