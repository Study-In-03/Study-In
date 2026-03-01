import { useLocation, Navigate } from 'react-router-dom';
import PasswordResetForm from '@/features/auth/components/PasswordResetForm';

export default function ResetPassword() {
    const location = useLocation();
    const email = location.state?.email;

    // 이메일 정보 없이 접근 -> 로그인 페이지로 이동
    if (!email) {
        alert('잘못된 접근입니다. 비밀번호 찾기부터 다시 진행해주세요.');
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-12">
            <h2 className="text-3xl font-bold text-black mb-[60px]">
                비밀번호 재설정
            </h2>

            <PasswordResetForm email={email} />
        </div>
    );
}