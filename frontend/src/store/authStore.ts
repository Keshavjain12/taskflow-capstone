import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (session: { user: AuthUser; accessToken: string; refreshToken: string }) => void;
  updateAccessToken: (accessToken: string) => void;
  clearSession: () => void;
}

/**
 * Client-only auth state (Zustand), persisted to localStorage so a page
 * refresh doesn't log the user out. Server state (projects/tasks) lives in
 * TanStack Query instead — this store is intentionally minimal.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setSession: ({ user, accessToken, refreshToken }) =>
        set({ user, accessToken, refreshToken }),
      updateAccessToken: (accessToken) => set({ accessToken }),
      clearSession: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: "taskflow-auth" },
  ),
);
