import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import loginIllustration from '@/assets/login-illustration.png';
import LoginForm from '@/features/auth/components/LoginForm';
import githubLogo from '@/assets/base/Logo-github.svg';
import kakaoLogo from '@/assets/base/Logo-kakao-message.svg';
import googleLogo from '@/assets/base/Logo-Google.svg';
import IconX from '@/assets/base/icon-X.svg?react';
import { validateEmail } from '@/features/auth/utils/authValidators';
import { sendPasswordResetEmail } from '@/api/auth';

type SnsProvider = { name: string; logo: string; logoClass?: string; bgClass: string };

const SNS_PROVIDERS: SnsProvider[] = [
    { name: 'GitHub', logo: githubLogo, logoClass: 'invert', bgClass: 'bg-gray-900' },
    { name: 'Kakao', logo: kakaoLogo, logoClass: 'brightness-0', bgClass: 'bg-[#FEE500]' },
    { name: 'Google', logo: googleLogo, bgClass: 'bg-background border border-gray-300' },
];

export default function Login() {
    const navigate = useNavigate();
    const [modalProvider, setModalProvider] = useState<SnsProvider | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [fpApiError, setFpApiError] = useState('');

    // 비밀번호 찾기 상태
    const [fpEmail, setFpEmail] = useState('');
    const [fpEmailError, setFpEmailError] = useState('');

    const handleFpEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFpEmail(value);
        if (value.length === 0) setFpEmailError('');
        else if (!validateEmail(value)) setFpEmailError('이메일 형식이 올바르지 않습니다.');
        else setFpEmailError('');
    };

    const isFpValid = fpEmail.length > 0 && validateEmail(fpEmail);

    const handleSendEmail = async () => {
        if (!isFpValid) return;
        try {
            await sendPasswordResetEmail(fpEmail);
        } catch (error: any) {
            // 인증번호는 123456 고정이므로, 이메일 발송 실패해도 진행
            console.error('이메일 발송 실패 (무시):', error);
        }
        // 성공/실패 관계없이 항상 이동
        setShowForgotPassword(false);
        navigate('/reset-password', { state: { email: fpEmail } });
    };

    // 모달 닫을 때 에러도 초기화
    const handleCloseForgotPassword = () => {
        setShowForgotPassword(false);
        setFpEmail('');
        setFpEmailError('');
        setFpApiError('');
    };

    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-12">

            <h2 className="text-2xl font-bold text-surface text-left leading-[1.6] mt-[52px] mb-5">
                SNS계정으로 간편하게<br />
                회원가입/로그인 하세요! :)
            </h2>

            <img
                src={loginIllustration}
                alt="로그인 사자 일러스트"
                className="w-full max-w-[322px] h-auto rounded-3 object-contain mb-6"
            />

            <LoginForm />

            <div className="flex items-center gap-2 mt-6 text-sm text-gray-700">
                <Link to="/register" className="hover:text-primary-light transition-colors">회원가입</Link>
                <span className="w-[1px] h-3 bg-gray-700"></span>
                <button
                    onClick={() => setShowForgotPassword(true)}
                    className="hover:text-primary-light transition-colors"
                >
                    비밀번호 찾기
                </button>
            </div>

            {/* SNS 로그인 */}
            <div className="flex flex-col items-center gap-4 mt-6 w-full max-w-[322px]">
                {/* 구분선 + 텍스트 */}
                <div className="flex items-center gap-3 w-full">
                    <div className="flex-1 h-[1px] bg-gray-300" />
                    <span className="text-sm text-gray-500 shrink-0">간편로그인</span>
                    <div className="flex-1 h-[1px] bg-gray-300" />
                </div>
                {/* SNS 버튼들 */}
                <div className="flex items-center gap-4">
                    {SNS_PROVIDERS.map((provider) => (
                        <button
                            key={provider.name}
                            onClick={() => setModalProvider(provider)}
                            className={`w-11 h-11 rounded-full ${provider.bgClass} flex items-center justify-center hover:opacity-80 transition-opacity`}
                        >
                            <img src={provider.logo} alt={`${provider.name} 로그인`} className={`w-6 h-6 ${provider.logoClass ?? ''}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* 구현 중 모달 */}
            {modalProvider && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
                    onClick={() => setModalProvider(null)}
                >
                    <div
                        className="bg-background rounded-[12px] px-8 py-6 flex flex-col items-center gap-4 shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img src={modalProvider.logo} alt="" className="w-10 h-10" />
                        <p className="text-base font-bold text-surface">{modalProvider.name} 로그인</p>
                        <p className="text-sm text-gray-500 text-center">현재 구현 중인 기능입니다.</p>
                        <button
                            onClick={() => setModalProvider(null)}
                            className="w-full h-[40px] bg-primary text-background rounded-[8px] text-sm font-medium"
                        >
                            확인
                        </button>
                    </div>
                </div>
            )}

            {/* 비밀번호 찾기 모달 */}
            {showForgotPassword && (
                <div
                    className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
                    onClick={handleCloseForgotPassword}
                >
                    <div
                        className="relative w-full max-w-[390px] bg-background rounded-[10px] shadow-lg outline outline-1 outline-gray-300 flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 닫기 버튼 */}
                        <button
                            onClick={handleCloseForgotPassword}
                            className="absolute top-[10px] right-[10px] p-0 cursor-pointer z-10"
                        >
                            <IconX className="w-5 h-5 text-gray-500 hover:text-primary-light transition-colors" />
                        </button>

                        <div className="px-8 pt-[34px] pb-6">
                            {/* 타이틀 및 설명 */}
                            <div className="text-center mb-7 mt-2">
                                <h2 className="text-lg font-bold text-surface mb-3">비밀번호 찾기</h2>
                                <p className="text-sm font-regular text-surface leading-relaxed">
                                    가입시 등록한 이메일을 입력해 주세요.<br />
                                    비밀번호 재설정 링크를 이메일로 보내드릴게요 :)
                                </p>
                            </div>

                            {/* 이메일 입력 */}
                            <div className="relative mb-2">
                                <input
                                    type="email"
                                    placeholder="이메일 입력"
                                    value={fpEmail}
                                    onChange={handleFpEmailChange}
                                    className={`w-full border-b-2 py-3 text-base font-regular placeholder:text-gray-500 focus:outline-none transition-colors ${
                                        isFpValid
                                            ? 'border-primary text-surface'
                                            : 'border-gray-300 text-surface focus:border-primary'
                                    }`}
                                />
                                {fpEmailError && <p className="text-error text-sm mt-2 absolute">{fpEmailError}</p>}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSendEmail}
                            disabled={!isFpValid}
                            className={`w-full font-medium text-lg py-[18px] transition-colors ${
                                isFpValid
                                    ? 'bg-primary text-background hover:bg-primary-light cursor-pointer'
                                    : 'bg-gray-300 text-background cursor-not-allowed'
                            }`}
                        >
                            이메일 보내기
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
