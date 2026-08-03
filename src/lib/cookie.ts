import { APP_CONFIG } from "@/lib/config";

/**
 * Cookie helpers for the access token.
 * The token lives in a cookie so the Next.js middleware can read it
 * for route protection (middleware can't access localStorage).
 */
export function setAccessTokenCookie(token: string): void {
  document.cookie = `${APP_CONFIG.accessTokenCookie}=${encodeURIComponent(
    token
  )}; path=/; max-age=${APP_CONFIG.cookieMaxAgeSeconds}; SameSite=Lax`;
}

export function getAccessTokenCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${APP_CONFIG.accessTokenCookie}=([^;]+)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

export function deleteAccessTokenCookie(): void {
  document.cookie = `${APP_CONFIG.accessTokenCookie}=; path=/; max-age=0`;
}