import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_ID_KEY, USER_EMAIL_KEY } from '../constants/auth';

export const storage = {
    // Access Token 관리
    getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
    setAccessToken: (token: string) => localStorage.setItem(ACCESS_TOKEN_KEY, token),
    removeAccessToken: () => localStorage.removeItem(ACCESS_TOKEN_KEY),

    // Refresh Token 관리
    getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
    setRefreshToken: (token: string) => localStorage.setItem(REFRESH_TOKEN_KEY, token),
    removeRefreshToken: () => localStorage.removeItem(REFRESH_TOKEN_KEY),

    // 사용자 ID 관리
    getUserId: () => {
        const id = localStorage.getItem(USER_ID_KEY);
        return id ? Number(id) : null;
    },
    setUserId: (id: number) => localStorage.setItem(USER_ID_KEY, String(id)),
    removeUserId: () => localStorage.removeItem(USER_ID_KEY),

    // 로그아웃 시 한 번에 싹 비우기
    clearAuth: () => {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_ID_KEY);
        localStorage.removeItem(USER_EMAIL_KEY);
    },

    // 이메일 관리
    getEmail: () => localStorage.getItem(USER_EMAIL_KEY),   
    setEmail: (email: string) => localStorage.setItem(USER_EMAIL_KEY, email),
    removeEmail: () => localStorage.removeItem(USER_EMAIL_KEY),

};