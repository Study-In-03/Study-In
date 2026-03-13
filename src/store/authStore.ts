import { create } from 'zustand';
import { storage } from '@/utils/storage';

interface User {
  pk: number;
  email: string;
  nickname: string;
}

interface AuthState {
  isLoggedIn: boolean;
  isAssociateMember: boolean;       
  user: User | null;
  login: (userData: User, isAssociate: boolean) => void;
  logout: () => void;
  setUser: (userData: User) => void;
  setIsAssociateMember: (value: boolean) => void;  
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!storage.getAccessToken(),
  isAssociateMember: storage.getIsAssociate(),         

  user: storage.getUserId()
    ? { pk: storage.getUserId()!, email: storage.getEmail() ?? '', nickname: storage.getNickname() ?? '' }
    : null,

  login: (userData, isAssociate: boolean) => {
  if (userData.nickname) storage.setNickname(userData.nickname);
    storage.setIsAssociate(isAssociate);
    set({
      isLoggedIn: true,
      user: userData,
      isAssociateMember: isAssociate,
    });
  },
  logout: () => {
    storage.clearAuth();
    set({ isLoggedIn: false, user: null, isAssociateMember: false });
  },
  setUser: (userData) => set({ user: userData }),
  setIsAssociateMember: (value) => set({ isAssociateMember: value }),  // fix: 추가
}));