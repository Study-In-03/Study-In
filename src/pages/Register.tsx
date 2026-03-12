import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '@/features/auth/components/RegisterForm';
import IconCheck from '@/assets/base/icon-Check-fill.svg?react';

export default function Register() {
    const navigate = useNavigate();
    const [isSuccess, setIsSuccess] = useState(false);

    return (
        <div>
            {/* 본문 영역 */}
            <main className="flex flex-col items-center mb-10">
                {!isSuccess ? (
                    <>
                        <h2 className="text-3xl font-bold text-surface mt-10 mb-[60px]">회원가입</h2>
                        
                        {/* 폼 영역 */}
                        <div className="w-full max-w-[322px]">
                            <RegisterForm onSuccess={() => setIsSuccess(true)} />
                        </div>
                    </>
                ) : (
                    /* isSuccess = true 시 보여줄 완료 화면 */
                    <div className="flex flex-col items-center mt-[120px] w-full max-w-[322px] text-center gap-5">
                        <div>
                            <IconCheck className="w-[60px] h-[60px]" />
                        </div>
                        
                        <h2 className="text-3xl font-bold text-surface">회원가입 완료!</h2>
                        
                        <p className="text-base font-regular text-gray-700 mb-[10px] leading-relaxed">
                            스터디인 회원가입을 완료했어요.<br />
                            로그인 후 <span className="font-bold text-gray-700">프로필 생성</span>을 진행해 볼까요?
                        </p>
                        
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-primary text-background font-medium py-[14px] rounded-[8px] hover:bg-primary-light transition-colors"
                        >
                            로그인하기
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}