import { useState } from 'react';
import { checkEmailDuplicate, sendRegisterEmail, verifyRegisterCode, registerApi } from '@/api/auth';
import { validateEmail } from '@/features/auth/utils/authValidators';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const [isDuplicateChecked, setIsDuplicateChecked] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const extractErrorMessage = (error: any, defaultMessage: string) => {
        const data = error.response?.data;
        if (!data) return defaultMessage;
        if (data.error) return data.error;
        if (Array.isArray(data.email)) return data.email[0];
        return defaultMessage;
    };

    // 이메일 중복 확인
    const checkDuplicate = async (email: string) => {
        if (!validateEmail(email)) return false;
        setIsLoading(true);
        setApiError(null);
        try {
            await checkEmailDuplicate(email);
            setIsDuplicateChecked(true);
            return true;
        } catch (error: any) {
            setApiError(extractErrorMessage(error, '사용 중인 이메일입니다.'));
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
            if (error.response?.status === 409) {
                setApiError('사용 중인 이메일입니다.');
            } else {
                setApiError(extractErrorMessage(error, '인증 코드 발송에 실패했습니다.'));
            }
            return false;
        } finally {
            setIsLoading(false);
        }
    }

    // 인증 코드 검증
    const verifyCode = async (email: string, code: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            await verifyRegisterCode(email, code);
            setIsVerified(true);
            return true;
        } catch (error: any) {
            setApiError(extractErrorMessage(error, '인증번호가 올바르지 않습니다.'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 회원가입
    const register = async (email: string, password: string) => {
        setIsLoading(true);
        setApiError(null);
        try {
            await registerApi({ email, password });
            return true;
        } catch (error: any) {
            setApiError(extractErrorMessage(error, '회원가입에 실패했습니다.'));
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
        register,
    };
};
