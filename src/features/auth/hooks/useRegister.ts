import { useState } from 'react';
import { checkEmailDuplicate, sendRegisterEmail, verifyRegisterCode } from '@/api/auth';
import { validateEmail } from '@/features/auth/utils/authValidators';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    // 에러 메시지 출력 함수
    const extractErrorMessage = (error: any, defaultMessage: string) => {
        const data = error.response?.data;
        if (!data) return defaultMessage;
        
        // "error": "메시지" 형태일 때
        if (data.error) return data.error;
        // "email": ["메시지"] 형태일 때
        if (Array.isArray(data.email)) return data.email[0];
        
        return defaultMessage;
    };

    // 중복 확인
    const checkDuplicate = async (email: string) => {
        if (!validateEmail(email)) return false;
        setIsLoading(true);
        setApiError(null);
        try {
            await checkEmailDuplicate(email);
            setIsDuplicateChecked(true);
            return true;
        } catch (error: any) {
            // 409 에러 발생 시 여기로 옴
            setApiError(extractErrorMessage(error, '이미 사용 중인 이메일입니다.'));
            setIsDuplicateChecked(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 인증 코드 발송
    const sendVerificationCode = async (email: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            await sendRegisterEmail(email);
            setIsCodeSent(true);
            return true;
        } catch (error: any) {
            // 409: {"error": "이미 가입되어 있는 회원입니다."} 또는 400 에러 처리
            setApiError(extractErrorMessage(error, '인증 코드 발송에 실패했습니다.'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 인증 코드 검증
    const verifyCode = async (email: string, code: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            await verifyRegisterCode(email, code);
            setIsVerified(true);
            return true;
        } catch (error: any) {
            // 400: {"error": "인증번호가 다릅니다."} 
            setApiError(extractErrorMessage(error, '인증번호가 올바르지 않습니다.'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        apiError,
        setApiError,
        isDuplicateChecked,
        setIsDuplicateChecked,
        isCodeSent,
        isVerified,
        checkDuplicate,
        sendVerificationCode,
        verifyCode,
    };
};