// lib/store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id?: string;
  username: string;
  email: string;
  avatar: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-store",
    }
  )
);
