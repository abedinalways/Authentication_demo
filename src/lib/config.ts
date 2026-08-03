/**
 * Global app configuration.
 * Point NEXT_PUBLIC_API_URL at your real backend (NestJS + Prisma + PostgreSQL).
 */
export const APP_CONFIG = {
  name: "Auth Demo",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  accessTokenCookie: "accessToken",
  cookieMaxAgeSeconds: 60 * 60 * 24, // 1 day
} as const;