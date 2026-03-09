import { useState } from 'react';
import { verifyPasswordResetCode } from '@/api/auth';

export const usePasswordResetEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const verifyCode = async (email: string, code: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            await verifyPasswordResetCode(email, code);
            return true;
        } catch (error: any) {
            setApiError(error.response?.data?.error || '인증번호가 올바르지 않습니다.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { verifyCode, isLoading, apiError, setApiError };
};