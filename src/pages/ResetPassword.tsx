import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import PasswordResetForm from '@/features/auth/components/PasswordResetForm';
import { verifyPasswordResetCode } from '@/api/auth';

export default function ResetPassword() {
    const location = useLocation();
    const email = location.state?.email;
    const [isVerified, setIsVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(true);
    const [verifyError, setVerifyError] = useState('');

    useEffect(() => {
        if (!email) return;
        // 인증번호 123456 고정 → 페이지 진입 시 자동 verify
        verifyPasswordResetCode(email, '123456')
            .then(() => setIsVerified(true))
            .catch((err) => {
                const msg = err.response?.data?.error || '인증에 실패했습니다.';
                setVerifyError(msg);
            })
            .finally(() => setIsVerifying(false));
    }, [email]);

    if (!email) {
        alert('잘못된 접근입니다. 비밀번호 찾기부터 다시 진행해주세요.');
        return <Navigate to="/login" replace />;
    }

    if (isVerifying) {
        return (
            <div className="flex flex-col items-center justify-center w-full px-4 py-12">
                <p className="text-surface">인증 중...</p>
            </div>
        );
    }

    if (verifyError) {
        return (
            <div className="flex flex-col items-center justify-center w-full px-4 py-12">
                <p className="text-error">{verifyError}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-12">
            <h2 className="text-3xl font-bold text-black mb-[60px]">
                비밀번호 재설정
            </h2>
            {isVerified && <PasswordResetForm email={email} />}
        </div>
    );
}