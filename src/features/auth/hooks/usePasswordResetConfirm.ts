import { useState } from 'react';
import { confirmPasswordReset } from '@/api/auth';

export const usePasswordResetConfirm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const resetPassword = async (email: string, new_password: string) => {
        setIsLoading(true);
        setApiError(null);

        try {
            await confirmPasswordReset(email, new_password);
            return true;
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.non_field_errors?.[0] ||
                error.response?.data?.new_password?.[0] ||
                '비밀번호 재설정에 실패했습니다.';
            setApiError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { resetPassword, isLoading, apiError, setApiError };
};