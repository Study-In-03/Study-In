import { useAuthStore } from '@/store/authStore';

export function useAuth() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const user = useAuthStore((state) => state.user);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const setUser = useAuthStore((state) => state.setUser);

    return { isLoggedIn, user, login, logout, setUser };
}