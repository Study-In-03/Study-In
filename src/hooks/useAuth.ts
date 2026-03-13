import { useAuthStore } from '@/store/authStore';

export function useAuth() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isAssociateMember = useAuthStore((state) => state.isAssociateMember);
    const user = useAuthStore((state) => state.user);
    const login = useAuthStore((state) => state.login);
    const logout = useAuthStore((state) => state.logout);
    const setUser = useAuthStore((state) => state.setUser);
    const setIsAssociateMember = useAuthStore((state) => state.setIsAssociateMember);

    return { isLoggedIn, isAssociateMember, user, login, logout, setUser, setIsAssociateMember };
}