import { useState } from 'react';
import { resetPasswordConfirm } from '@/api/auth';

export const usePasswordResetConfirm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const resetPassword = async (email: string, new_password: string) => {
        setIsLoading(true);
        setApiError(null);
        
        try {
            await resetPasswordConfirm(email, new_password);
            return true; // 성공 시 true 반환
        } catch (error: any) {
            // 서버에서 주는 에러 메시지 처리
            const errorMessage = error.response?.data?.error || error.response?.data?.new_password?.[0] || '비밀번호 재설정에 실패했습니다.';
            setApiError(errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { resetPassword, isLoading, apiError, setApiError };
};