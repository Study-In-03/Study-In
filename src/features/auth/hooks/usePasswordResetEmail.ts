import { useState } from 'react';
import { sendPasswordResetEmail } from '@/api/auth';

export const usePasswordResetEmail = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const sendEmail = async (email: string) => {
        setIsLoading(true);
        setApiError(null);
        
        try {
            await sendPasswordResetEmail(email);
            return true; // 성공 시 true 반환
        } catch (error: any) {
            // 에러 = "error" 키
            const errorMessage = error.response?.data?.error || '이메일 발송에 실패했습니다.';
            setApiError(errorMessage);
            return false; // 실패 시 false 반환
        } finally {
            setIsLoading(false);
        }
    };

    return { sendEmail, isLoading, apiError, setApiError };
};