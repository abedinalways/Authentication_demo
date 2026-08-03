"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { extractErrorMessage } from "@/lib/error";
import { deleteAccessTokenCookie, setAccessTokenCookie } from "@/lib/cookie";
import {
  forceLogout,
  setCredentials,
  setEmailForReset,
  setResetToken,
} from "@/lib/redux/features/auth/authSlice";
import {
  useForgotPasswordMutation,
  useGetCurrentUserQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
} from "@/lib/redux/features/auth/authApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import type { RegisterCredentials } from "@/types/auth";

type Result = { ok: boolean; message?: string };

export function useAuth() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user, refreshToken, isAuthenticated, emailForReset, resetToken } =
    useAppSelector((state) => state.auth);

  const [registerMutation] = useRegisterMutation();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [verifyOTPMutation] = useVerifyOTPMutation();
  const [resetPasswordMutation] = useResetPasswordMutation();
  const [refreshTokenMutation] = useRefreshTokenMutation();

  const { refetch, isLoading: isFetchingUser } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<Result> => {
      try {
        const response = await registerMutation(credentials).unwrap();
        setAccessTokenCookie(response.tokens.accessToken);
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
          })
        );
        return { ok: true };
      } catch (err) {
        return { ok: false, message: extractErrorMessage(err) };
      }
    },
    [dispatch, registerMutation]
  );

  const login = useCallback(
    async (credentials: { email: string; password: string }): Promise<Result> => {
      try {
        const response = await loginMutation(credentials).unwrap();
        setAccessTokenCookie(response.tokens.accessToken);
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.tokens.accessToken,
            refreshToken: response.tokens.refreshToken,
          })
        );
        return { ok: true };
      } catch (err) {
        return { ok: false, message: extractErrorMessage(err) };
      }
    },
    [dispatch, loginMutation]
  );

  const logout = useCallback(async (): Promise<void> => {
    deleteAccessTokenCookie();
    try {
      if (refreshToken) await logoutMutation({ refreshToken }).unwrap();
    } catch {
      // Server-side invalidation failing shouldn't block local logout.
    }
    dispatch(forceLogout());
    router.push("/login");
  }, [dispatch, logoutMutation, refreshToken, router]);

  const forgotPassword = useCallback(
    async (email: string): Promise<Result & { otp?: string }> => {
      try {
        const response = await forgotPasswordMutation({ email }).unwrap();
        dispatch(setEmailForReset(email));
        return { ok: true, otp: response.otp };
      } catch (err) {
        return { ok: false, message: extractErrorMessage(err) };
      }
    },
    [dispatch, forgotPasswordMutation]
  );

  const verifyOTP = useCallback(
    async (otp: string): Promise<Result> => {
      if (!emailForReset) {
        return { ok: false, message: "No email found for this flow. Start again." };
      }
      try {
        const response = await verifyOTPMutation({ email: emailForReset, otp }).unwrap();
        dispatch(setResetToken(response.resetToken));
        return { ok: true };
      } catch (err) {
        return { ok: false, message: extractErrorMessage(err) };
      }
    },
    [dispatch, emailForReset, verifyOTPMutation]
  );

  const resetPassword = useCallback(
    async (newPassword: string): Promise<Result> => {
      if (!resetToken) {
        return { ok: false, message: "Reset token is missing. Start the flow again." };
      }
      try {
        await resetPasswordMutation({
          resetToken,
          newPassword,
        }).unwrap();
        dispatch(forceLogout());
        return { ok: true };
      } catch (err) {
        return { ok: false, message: extractErrorMessage(err) };
      }
    },
    [dispatch, resetPasswordMutation, resetToken]
  );

  /** Manual / proactive refresh: exchanges the refresh token for fresh tokens. */
  const refresh = useCallback(async (): Promise<Result> => {
    if (!refreshToken) return { ok: false, message: "No refresh token available." };
    try {
      const response = await refreshTokenMutation({ refreshToken }).unwrap();
      setAccessTokenCookie(response.tokens.accessToken);
      dispatch(
        setCredentials({
          user: response.user,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken,
        })
      );
      return { ok: true };
    } catch (err) {
      return { ok: false, message: extractErrorMessage(err) };
    }
  }, [dispatch, refreshToken, refreshTokenMutation]);

  return {
    user,
    refreshToken,
    isAuthenticated,
    emailForReset,
    resetToken,
    isFetchingUser,
    register,
    login,
    logout,
    forgotPassword,
    verifyOTP,
    resetPassword,
    refresh,
    refetch,
  };
}