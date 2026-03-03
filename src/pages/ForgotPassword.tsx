import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '@/features/auth/utils/authValidators';
import IconX from '@/assets/base/icon-X.svg?react';
import { usePasswordResetEmail } from '@/features/auth/hooks/usePasswordResetEmail';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const { sendEmail, isLoading, apiError, setApiError } = usePasswordResetEmail();

    // 실시간 이메일 유효성 검사
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);

        if (apiError) {
            setApiError(null);
        }

        if (value.length === 0) {
            setEmailError('');
        } else if (!validateEmail(value)) {
            setEmailError('이메일 형식이 올바르지 않습니다.'); 
        } else {
            setEmailError('');
        }
    };

    // 이메일이 입력되었고, 에러가 없을 때만 버튼 활성화
    const isValid = email.length > 0 && validateEmail(email);

    const handleSubmit = async () => {
        if (!isValid || isLoading) return;
        
        // 서버에 이메일 발송 요청
        const isSuccess = await sendEmail(email);
        
        // 성공하면 재설정 페이지로 이동 (이메일 정보와 고정 인증번호 전달)
        if (isSuccess) {
            alert('비밀번호 재설정 링크가 이메일로 발송되었습니다.');
            navigate('/reset-password', { 
                state: { email: email } 
            }); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="relative w-full max-w-[390px] bg-background rounded-[10px] shadow-lg flex flex-col overflow-hidden">
                
                {/* 닫기 (X) 버튼 -> 뒤로가기 */}
                <button 
                    onClick={() => navigate(-1)}
                    className="absolute top-2 right-2 p-2 cursor-pointer z-10"
                >
                    <IconX className="w-5 h-5 text-gray-500 hover:text-primary-light transition-colors" />
                </button>
                
                <div className="px-8 pt-[34px] pb-6">
                    {/* 타이틀 및 설명 */}
                    <div className="text-center mb-7 mt-2">
                        <h2 className="text-xl font-bold text-surface mb-3">비밀번호 찾기</h2>
                        <p className="text-base font-regular text-surface leading-relaxed">
                            가입시 등록한 이메일을 입력해 주세요.<br />
                            비밀번호 재설정 링크를 이메일로 보내드릴게요 :)
                        </p>
                    </div>

                    {/* 이메일 입력 폼 */}
                    <div className="relative mb-2">
                        <input
                            type="email"
                            placeholder="이메일 입력"
                            value={email}
                            onChange={handleEmailChange}
                            className={`w-full border-b-2 py-3 text-base font-regular placeholder:text-gray-400 focus:outline-none transition-colors ${
                                isValid 
                                ? 'border-primary text-surface' 
                                : 'border-gray-300 text-surface focus:border-primary'
                            }`}
                        />
                        {emailError && <p className="text-error text-xs mt-2 absolute">{emailError}</p>}
                    </div>
                    {apiError && <p className="text-error text-xs text-center mt-6">{apiError}</p>}
                </div>

                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isValid}
                    className={`w-full font-medium text-lg py-[18px] transition-colors ${
                        isValid
                            ? 'bg-primary text-background hover:bg-primary-light cursor-pointer'
                            : 'bg-gray-300 text-background cursor-not-allowed'
                    }`}
                >
                    {isLoading ? '발송 중...' : '이메일 보내기'}
                </button>
            </div>
        </div>
    );
}