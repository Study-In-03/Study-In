import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validatePassword } from '../utils/authValidators';
import { usePasswordResetConfirm } from '../hooks/usePasswordResetConfirm';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

// 이전 페이지에서 넘어온 이메일을 Props로 받음
interface PasswordResetFormProps {
    email: string;
}

export default function PasswordResetForm({ email }: PasswordResetFormProps) {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    const { resetPassword, isLoading, apiError, setApiError } = usePasswordResetConfirm();

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (apiError) setApiError(null);

        // 비밀번호 유효성 검사 (영문, 숫자 포함 8자)
        if (value.length === 0) setPasswordError('');
        else if (!validatePassword(value)) setPasswordError('영문, 숫자 포함 8자 이상 입력해주세요.');
        else setPasswordError('');

        // '비밀번호 확인' 칸과 일치하는지 실시간 체크
        if (passwordConfirm.length > 0 && value !== passwordConfirm) {
            setConfirmError('비밀번호가 일치하지 않습니다.');
        } else {
            setConfirmError('');
        }
    };

    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPasswordConfirm(value);
        if (apiError) setApiError(null);

        if (value.length === 0) setConfirmError('');
        else if (password !== value) setConfirmError('비밀번호가 일치하지 않습니다.');
        else setConfirmError('');
    };

    // 둘 다 값이 있고, 에러가 없을 때만 버튼 활성화
    const isValid = password.length > 0 && passwordConfirm.length > 0 && !passwordError && !confirmError;

    const handleSubmit = async () => {
        if (!isValid || isLoading) return;

        const isSuccess = await resetPassword(email, password);
        
        if (isSuccess) {
            alert('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요!');
            navigate('/login', { replace: true }); // 로그인 화면으로 이동 (뒤로가기 방지)
        }
    };

    return (
        <div className="w-full max-w-[322px] flex flex-col gap-4">
            
            {/* 새 비밀번호 입력 */}
            <Input
                variant="auth"
                type="password"
                placeholder="새 비밀번호"
                value={password}
                onChange={handlePasswordChange}
                errorMessage={passwordError}
            />

            {/* 새 비밀번호 확인 */}
            <div className="w-full flex justify-center mb-3">
                <Input
                    variant="auth"
                    type="password"
                    placeholder="새 비밀번호 확인"
                    value={passwordConfirm}
                    onChange={handleConfirmChange}
                    errorMessage={confirmError}
                />
            </div>

            {apiError && <p className="text-error text-xs text-center">{apiError}</p>}

            {/* 제출 버튼 */}
            <div className="mt-3">
                <Button
                    variant="auth"
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isValid}
                    isLoading={isLoading}
                >
                    {isLoading ? '변경 중...' : '비밀번호 재설정하기'}
                </Button>
            </div>
        </div>
    );
}