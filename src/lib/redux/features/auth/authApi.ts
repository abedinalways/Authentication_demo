import { apiSlice } from "@/lib/redux/features/api/apiSlice";
import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginCredentials,
  RegisterCredentials,
  ResetPasswordRequest,
  User,
  VerifyOTPRequest,
} from "@/types/auth";

interface SimpleResponse {
  message: string;
}

interface OTPResponse {
  message: string;
  otp?: string;
}

interface VerifyOTPResponse {
  message: string;
  resetToken: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterCredentials>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
      extraOptions: { skipAuthRefresh: true },
    }),
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      extraOptions: { skipAuthRefresh: true },
    }),
    logout: builder.mutation<SimpleResponse, { refreshToken?: string | null }>({
      query: (body) => ({ url: "/auth/logout", method: "POST", body }),
      extraOptions: { skipAuthRefresh: true },
    }),
    forgotPassword: builder.mutation<OTPResponse, ForgotPasswordRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
      extraOptions: { skipAuthRefresh: true },
    }),
    verifyOTP: builder.mutation<VerifyOTPResponse, VerifyOTPRequest>({
      query: (body) => ({ url: "/auth/check-otp", method: "POST", body }),
      extraOptions: { skipAuthRefresh: true },
    }),
    resetPassword: builder.mutation<SimpleResponse, ResetPasswordRequest>({
      query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      extraOptions: { skipAuthRefresh: true },
    }),
    refreshToken: builder.mutation<AuthResponse, { refreshToken: string }>({
      query: (body) => ({ url: "/auth/refresh", method: "POST", body }),
      extraOptions: { skipAuthRefresh: true },
    }),
    getCurrentUser: builder.query<{ user: User }, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
} = authApi;