import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "@/types/auth";

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  emailForReset: string | null;
  resetToken: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  emailForReset: null,
  resetToken: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{
        user?: User | null;
        accessToken: string;
        refreshToken: string;
      }>
    ) {
      state.user = action.payload.user ?? state.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setEmailForReset(state, action: PayloadAction<string>) {
      state.emailForReset = action.payload;
    },
    setResetToken(state, action: PayloadAction<string>) {
      state.resetToken = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    forceLogout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.resetToken = null;
      state.emailForReset = null;
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  updateUser,
  setEmailForReset,
  setResetToken,
  setError,
  clearError,
  forceLogout,
} = authSlice.actions;

export default authSlice.reducer;