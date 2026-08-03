# Auth Demo — Frontend Authentication

A clean, production-ready **frontend-only** authentication system built with:

- **Next.js 16** (App Router)
- **Redux Toolkit + RTK Query** — API layer & state
- **Redux Persist** — session persistence
- **react-hook-form + Zod** — form validation
- **Cookie-based access token** — for route protection

## Features

- ✅ Register
- ✅ Login
- ✅ Logout
- ✅ Forgot password (OTP flow)
- ✅ Route protection (proxy/middleware)
- ✅ Auto token refresh on 401
- ✅ TypeScript throughout

## Getting Started

```bash
npm install
npm run dev
```

## Backend

This repo is **frontend only**. Point `NEXT_PUBLIC_API_URL` at your backend
(e.g. NestJS + Prisma + PostgreSQL):

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Expected API contract

| Method | Endpoint              | Body                                        | Response |
|--------|-----------------------|---------------------------------------------|----------|
| POST   | `/auth/register`      | `{ name, email, password }`                 | `{ user, tokens }` |
| POST   | `/auth/login`         | `{ email, password }`                       | `{ user, tokens }` |
| POST   | `/auth/logout`        | `{ refreshToken }`                          | `{ message }` |
| POST   | `/auth/forgot-password` | `{ email }`                               | `{ message, otp? }` |
| POST   | `/auth/check-otp`     | `{ email, otp }`                            | `{ message, resetToken }` |
| POST   | `/auth/reset-password`| `{ resetToken, newPassword }`               | `{ message }` |
| POST   | `/auth/refresh`       | `{ refreshToken }`                          | `{ user, tokens }` |
| GET    | `/auth/me`            | — (Bearer token)                            | `{ user }` |

### Token shape

```ts
tokens: {
  accessToken: string;
  refreshToken: string;
}
```

## Project Structure

```
src/
├── app/
│   ├── login/            # Login page
│   ├── register/         # Register page
│   ├── forgot-password/  # Forgot password page
│   ├── verify-otp/       # OTP verification page
│   ├── reset-password/   # Reset password page
│   ├── success/          # Success page
│   └── dashboard/        # Protected page
├── components/auth/      # Auth forms & UI
├── hooks/useAuth.ts      # Central auth hook
├── lib/
│   ├── config.ts         # App config
│   ├── cookie.ts         # Cookie helpers
│   ├── error.ts          # Error extraction
│   └── validation/       # Zod schemas
├── lib/redux/
│   ├── store.ts          # Redux store
│   └── features/
│       ├── api/          # RTK Query base
│       └── auth/         # Auth API + slice
├── proxy.ts              # Route protection
└── types/auth.ts         # Shared types
```

## How it works

1. **Login/Register** → RTK Query mutation → backend returns `{ user, tokens }`
2. **Access token** stored in a cookie (readable by proxy for route protection)
3. **User + refresh token** stored in Redux (persisted to localStorage)
4. **Every API call** attaches `Authorization: Bearer <accessToken>` from cookie
5. **On 401** → auto-refresh via `/auth/refresh` → retry original request
6. **Proxy** redirects unauthenticated users away from `/dashboard`