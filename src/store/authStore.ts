import { create } from 'zustand';
import { storage } from '@/utils/storage';

interface User {
  pk: number;
  email: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null; // 내 정보 저장
  login: (userData: User) => void;
  logout: () => void;
  setUser: (userData: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!storage.getAccessToken(),
  user: null, 
  login: (userData) => set({ isLoggedIn: true, user: userData }),
  logout: () => {
    storage.clearAuth();
    set({ isLoggedIn: false, user: null });
  },
  setUser: (userData) => set({ user: userData }),
}));