import { useAuthStore } from '@/store/authStore';

export function useAuth() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);

    return {
        isLoggedIn,
        login,
        logout,
    };
}