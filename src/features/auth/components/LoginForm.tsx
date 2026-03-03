import { useState } from 'react';
import { validateEmail, validatePassword } from '../utils/authValidators';
import { useLogin } from '../hooks/useLogin';
import Input from '@/components/common/Input'; 
import Button from '@/components/common/Button';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { login, isLoading, apiError } = useLogin();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        
        if (value.length === 0) {
            setEmailError('');
        } else if (!validateEmail(value)) {
            setEmailError('이메일을 확인해 주세요.');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        
        if (value.length === 0) {
            setPasswordError('');
        } else if (!validatePassword(value)) {
            setPasswordError('비밀번호를 확인해 주세요.');
        } else {
            setPasswordError('');
        }
    };

    const isValid = validateEmail(email) && validatePassword(password);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid && !isLoading) {
            await login(email, password);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-[322px] flex flex-col gap-3">
        
            {/* 이메일 입력 영역 */}
            <Input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={handleEmailChange}
                errorMessage={emailError}
            />

            {/* 비밀번호 입력 영역 */}
            <div className="mb-2"> 
                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={handlePasswordChange}
                    errorMessage={passwordError}
                />
            </div>

            {apiError && (
                <p className="text-error text-xs text-center mb-2">{apiError}</p>
            )}

            {/* 로그인 버튼 */}
            <Button 
                type="submit" 
                disabled={!isValid} 
                isLoading={isLoading}
            >
                {isLoading ? '로그인 중...' : '로그인'}
            </Button>
        </form>
    );
}