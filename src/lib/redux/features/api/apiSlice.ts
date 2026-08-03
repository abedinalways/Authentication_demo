import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { APP_CONFIG } from "@/lib/config";
import {
  deleteAccessTokenCookie,
  getAccessTokenCookie,
  setAccessTokenCookie,
} from "@/lib/cookie";
import { forceLogout, setCredentials } from "@/lib/redux/features/auth/authSlice";
import type { User } from "@/types/auth";

export interface AuthExtraOptions {
  /** Set true on auth endpoints whose 401 means "bad input", not "expired token". */
  skipAuthRefresh?: boolean;
}

interface AuthSliceState {
  auth: {
    user: User | null;
    refreshToken: string | null;
  };
}

interface RefreshResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

function redirectToLogin(): void {
  if (typeof window !== "undefined") {
    window.location.assign("/login");
  }
}

/**
 * Plain fetchBaseQuery — attaches `Authorization: Bearer <accessToken>`
 * from the cookie on every request.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: APP_CONFIG.apiUrl,
  prepareHeaders: (headers) => {
    const token = getAccessTokenCookie();
    if (token) headers.set("authorization", `Bearer ${token}`);
    return headers;
  },
});

/**
 * Custom baseQuery that adds the production feature:
 * on a 401 (expired access token) it calls POST /auth/refresh with the
 * refresh token, updates cookie + Redux, then RETRIES the original request.
 */
const baseQueryWithRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  AuthExtraOptions
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  const isUnauthorized =
    result.error && "status" in result.error && result.error.status === 401;

  // Skip the refresh dance for auth endpoints whose 401 means "bad
  // credentials/OTP" — refreshing there would just reload the page and wipe
  // the form error.
  if (isUnauthorized && !extraOptions?.skipAuthRefresh) {
    const refreshToken = (api.getState() as AuthSliceState).auth?.refreshToken;

    if (refreshToken) {
      const refreshResult = await rawBaseQuery(
        { url: "/auth/refresh", method: "POST", body: { refreshToken } },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const { user, tokens } = refreshResult.data as RefreshResponse;

        setAccessTokenCookie(tokens.accessToken);
        api.dispatch(
          setCredentials({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          })
        );

        result = await rawBaseQuery(args, api, extraOptions);
      } else {
        // Refresh token itself is invalid/expired — session is gone.
        api.dispatch(forceLogout());
        deleteAccessTokenCookie();
        redirectToLogin();
      }
    } else {
      // No refresh token stored — nothing to do but log out.
      api.dispatch(forceLogout());
      deleteAccessTokenCookie();
      redirectToLogin();
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRefresh,
  tagTypes: ["User"],
  endpoints: () => ({}),
});