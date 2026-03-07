import { create } from 'zustand';

interface AuthState {
  isLoggedIn: boolean;
  userPk: number | null; // 스터디 조회 및 프로필 접근을 위해 저장
  login: (accessToken: string, refreshToken: string, pk: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('access_token'),
  userPk: localStorage.getItem('user_pk') ? Number(localStorage.getItem('user_pk')) : null,

  login: (accessToken, refreshToken, pk) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user_pk', String(pk));
    set({ isLoggedIn: true, userPk: pk });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_pk');
    set({ isLoggedIn: false, userPk: null });
  },
}));