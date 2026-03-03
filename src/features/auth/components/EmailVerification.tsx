import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useRegister } from '../hooks/useRegister';
import { validateEmail } from '../utils/authValidators';

interface Props {
    onNext: (email: string) => void;
}

export default function EmailVerification({ onNext }: Props) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [emailError, setEmailError] = useState('');

    const {
        isLoading, apiError, setApiError,
        isDuplicateChecked, setIsDuplicateChecked,
        isCodeSent, isVerified,
        checkDuplicate, sendVerificationCode, verifyCode
    } = useRegister();

    // 이메일 입력 (입력 시 중복확인 초기화)
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setEmail(val);
        setIsDuplicateChecked(false);
        setApiError(null);
        
        if (val.length > 0 && !validateEmail(val)) {
            setEmailError('이메일 형식이 올바르지 않습니다.');
        } else {
            setEmailError('');
        }
    };

    // 중복 확인 버튼 클릭
    const handleCheckDuplicate = async () => {
        await checkDuplicate(email);
    };

    // 인증 번호 발송
    const handleSendCode = async () => {
        const success = await sendVerificationCode(email);
        if (success) alert('인증 코드가 발송되었습니다. (테스트 123456)');
    };

    // 인증 번호 확인
    const handleVerifyCode = async () => {
        await verifyCode(email, code);
    };

    const isEmailValid = email.length > 0 && !emailError;

    return (
        <div className="flex flex-col gap-4">
            {/* 이메일 입력 영역 */}
            <div className="flex gap-2 items-start">
                <div className="flex-1">
                    <Input
                        variant="auth"
                        type="email"
                        placeholder="이메일 입력"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={isVerified}
                    />
                </div>
                {!isDuplicateChecked ? (
                    <Button onClick={handleCheckDuplicate} disabled={!isEmailValid || isLoading}>
                        중복 확인
                    </Button>
                ) : (
                    <Button onClick={handleSendCode} disabled={isVerified || isLoading}>
                        {isCodeSent ? '재발송' : '인증 발송'}
                    </Button>
                )}
            </div>
            
            {apiError && !isCodeSent && <p className="text-error text-sm">{apiError}</p>}
            {isDuplicateChecked && !apiError && !isCodeSent && <p className="text-primary text-sm">사용 가능한 이메일입니다.</p>}

            {/* 인증번호 입력 영역 (인증 발송 후에만 렌더링) */}
            {isCodeSent && (
                <div className="flex gap-2 items-start mt-2">
                    <div className="flex-1">
                        <Input
                            variant="auth"
                            type="text"
                            maxLength={6}
                            placeholder="인증번호 6자리"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            disabled={isVerified}
                        />
                    </div>
                    <Button 
                        onClick={handleVerifyCode} 
                        disabled={code.length !== 6 || isVerified || isLoading}
                    >
                        {isVerified ? '인증 완료' : '인증 확인'}
                    </Button>
                </div>
            )}
            
            {apiError && isCodeSent && <p className="text-error text-sm">{apiError}</p>}

            {/* 다음 단계 버튼 */}
            <Button
                className="mt-6 w-full py-4 text-lg"
                disabled={!isVerified}
                onClick={() => onNext(email)}
            >
                다음 단계로
            </Button>
        </div>
    );
}