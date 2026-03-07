import { create } from 'zustand';
import { storage } from '@/utils/storage';

interface AuthState {
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!storage.getAccessToken(), // 토큰 있으면 로그인 상태로 초기화
  login: () => set({ isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false }),
}));
