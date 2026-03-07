import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: true,
  logout: () => set({ isLoggedIn: false }),
}));