import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useRegister } from '../hooks/useRegister';
import { validateEmail, validatePassword } from '../utils/authValidators';
import IconSend from '@/assets/base/icon-Send.svg?react';
import IconAlert from'@/assets/base/icon-alert-circle.svg?react';
import IconCheck from '@/assets/base/icon-Check-fill.svg?react';
import IconHelp from '@/assets/base/icon-help-circle.svg?react';
import IconClose from '@/assets/base/icon-X.svg?react';

interface RegisterFormProps {
    onSuccess: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    
    // 비밀번호 에러 상태
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');

    // 도움말 툴팁
    const [showTooltip, setShowTooltip] = useState(false);
    
    // 이메일 훅
    const {
        isLoading, apiError, setApiError,
        isCodeSent, isVerified,
        checkDuplicate, sendVerificationCode, verifyCode,
        register,
    } = useRegister();

    // 이메일 입력 핸들러
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (apiError) setApiError(null);
    };

    // 비밀번호 입력 핸들러
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);

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

    // 비밀번호 확인 핸들러
    const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPasswordConfirm(value);
        
        if (value.length === 0) setConfirmError('');
        else if (password !== value) setConfirmError('비밀번호가 일치하지 않습니다.');
        else setConfirmError('');
    };

    // 이메일 인증 버튼 클릭
    const handleSendAuth = async () => {
        if (!validateEmail(email)) {
            setApiError('이메일 형식이 올바르지 않습니다.');
            return;
        }
        
        // 중복 확인
        const isAvailable = await checkDuplicate(email);
        if (!isAvailable) return;

        // 발송
        const isSent = await sendVerificationCode(email);
        if (isSent) {
            alert('인증 코드가 발송되었습니다. (테스트용: 123456)');
        }
    };

    // 인증 코드 검증
    const handleVerifyCode = async () => {
        if (code.length === 0) {
            setApiError('인증번호를 입력해 주세요.');
            return;
        }
        if (code.length !== 6) {
            setApiError('인증번호 6자리를 입력해 주세요.');
            return;
        }
        const success = await verifyCode(email, code);
        if (success) {
            alert('이메일 인증이 완료되었습니다.');
        }
    };

    // 모든 조건 맞아야 가입 버튼 활성화
    const isReadyToSubmit = 
        isVerified && 
        password.length > 0 && 
        passwordConfirm.length > 0 && 
        !passwordError && 
        !confirmError;
    
    const handleSubmit = async () => {
        if (!isReadyToSubmit || isLoading) return;
        const success = await register(email, password);
        if (success) onSuccess();
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            
            <div>
                {/* 이메일 입력 및 인증 영역 */}
                <div className="flex items-end gap-3">
                    <input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={isVerified}
                        className="flex-1 border-b-2 border-gray-300 py-2 text-base text-surface placeholder:text-gray-500 focus:outline-none focus:border-primary transition-colors disabled:bg-transparent disabled:text-gray-500"
                    />
                    <button
                        type="button"
                        onClick={handleSendAuth}
                        disabled={email.length === 0 || isVerified || isLoading}
                        className={`w-[70px] py-[10px] rounded-[8px] text-base font-medium transition-colors ${
                            email.length > 0 && !isVerified
                                ? 'bg-primary text-background hover:bg-primary-light'
                                : 'bg-gray-300 text-background cursor-not-allowed'
                        }`}
                    >
                        {isVerified ? '인증됨' : (isCodeSent ? '재전송' : '인증')}
                    </button>
                </div>
                {/* 이메일 에러 메시지 (코드 발송 전) */}
                {apiError && !isCodeSent && (
                    <div className="flex items-center gap-1 mt-2 text-error text-base font-medium">
                        <IconAlert className="w-5 h-5 text-error shrink-0" />
                        <span>{apiError}</span>
                    </div>
                )}
            </div>

            {/* 인증번호 입력 폼 (이메일 발송 후에만 노출, 인증 완료되면 숨김) */}
            {isCodeSent && (
                <div className="flex flex-col gap-3">
                    <div className="bg-gray-100 border border-gray-300 rounded-[8px] p-5 flex flex-col gap-5">
                        <div className="flex items-start gap-2">
                            <IconSend className="text-primary shrink-0" />
                            <div className="font-regular text-base text-surface leading-snug">
                                이메일로 전송된 <br />
                                <span className="font-bold">인증코드</span>를 입력해 주세요 :)
                            </div>
                        </div>

                        {/* 입력칸 및 버튼 */}
                        <div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    maxLength={6}
                                    value={code}
                                    onChange={(e) => {
                                        setCode(e.target.value);
                                        if (apiError) setApiError(null);
                                    }}
                                    onBlur={() => {
                                        if (!isVerified && code.length === 0) {
                                            setApiError('이 필드는 필수 항목입니다.');
                                        }
                                    }}
                                    disabled={isVerified}
                                    className={`flex-1 border rounded-[8px] px-4 py-2 text-lg focus:outline-none transition-colors disabled:bg-background ${
                                        apiError ? 'border-error' : 'border-gray-300 focus:border-primary'
                                    }`}
                                />
                                <button
                                    type="button"
                                    onClick={handleVerifyCode}
                                    disabled={isLoading || isVerified}
                                    className={`w-[70px] shrink-0 rounded-[8px] py-2 text-base font-medium transition-colors ${
                                        code.length === 6 && !isVerified
                                            ? 'bg-primary text-background hover:bg-primary-light'
                                            : 'bg-gray-300 text-background cursor-not-allowed'
                                    }`}
                                >
                                    확인
                                </button>
                            </div>

                            {/* 에러 메시지 */}
                            {apiError && !isVerified && (
                                <div className="flex items-center gap-1 mt-2 text-error text-base font-medium">
                                    <IconAlert className="w-5 h-5 text-error shrink-0" />
                                    <span>{apiError}</span>
                                </div>
                            )}

                            {/* 성공 메시지 */}
                            {isVerified && (
                                <div className="flex items-center gap-1 mt-2 text-primary text-base font-medium">
                                    <IconCheck className="w-5 h-5 shrink-0" />
                                    <span>이메일 인증이 완료되었어요 :)</span>
                                </div>
                            )}
                        </div>
                    </div> 

                    <div className="flex items-center gap-1 relative">
                        <button
                            type="button"
                            onClick={() => setShowTooltip((prev) => !prev)}
                            className="shrink-0"
                        >
                            <IconHelp className="w-4 h-4 text-gray-500" />
                        </button>
                        <p className="text-sm text-gray-500 font-regular">인증코드를 받지 못하셨나요?</p>
                        <button
                            type="button"
                            onClick={handleSendAuth}
                            disabled={isVerified}
                            className="text-sm text-primary font-bold hover:underline disabled:cursor-not-allowed disabled:hover:no-underline"
                        >
                            재전송
                        </button>

                        {/* 말풍선 툴팁 */}
                        {showTooltip && (
                            <div className="absolute top-[calc(100%+10px)] left-0 z-50 w-[310px] rounded-[10px] p-4 drop-shadow-lg" style={{ backgroundColor: '#47494D' }}>
                                {/* 삼각형 포인터 (위쪽) */}
                                <svg
                                    className="absolute -top-[10px] left-3"
                                    width="12" height="10"
                                    viewBox="0 0 12 10"
                                    fill="none"
                                >
                                    <polygon points="0,10 12,10 6,0" fill="#47494D" />
                                </svg>

                                {/* 닫기 버튼 */}
                                <button
                                    type="button"
                                    onClick={() => setShowTooltip(false)}
                                    className="absolute top-3 right-3"
                                >
                                    <IconClose className="w-4 h-4 text-gray-400" />
                                </button>

                                {/* 제목 */}
                                <p className="text-sm font-bold text-white mb-2">이메일이 수신되지 않나요? :(</p>

                                {/* 본문 */}
                                <p className="text-xs text-white leading-relaxed">
                                    - 이메일 주소가 정확히 입력되었는지 확인해 주세요.<br />
                                    - 스팸 메일함을 확인해 주세요.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            )}

            {/* 비밀번호 영역 */}
            <div>
                <div>
                    <Input
                        variant="auth"
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={handlePasswordChange}
                        errorMessage={passwordError}
                    />
                </div>
                <div className="mt-3">
                    <Input
                        variant="auth"
                        type="password"
                        placeholder="비밀번호 확인"
                        value={passwordConfirm}
                        onChange={handleConfirmChange}
                        errorMessage={confirmError}
                    />
                </div>
            </div>

            <div className="gap-3">
                {/* 약관 동의 텍스트 */}
                <div className="mt-5 text-base text-surface font-medium text-left leading-relaxed">
                    본인은 만 14세 이상이며, 스터디인의 <br />
                    <a href="#" className="text-primary underline underline-offset-2 hover:text-primary-light">이용 약관</a>, <a href="#" className="text-primary underline underline-offset-2 hover:text-primary-light">개인정보취급방침</a>을 확인하였습니다.
                </div>

                {/* 최종 가입 버튼 */}
                <Button
                    className="mt-3 py-[14px] text-lg text-background font-medium"
                    disabled={!isReadyToSubmit || isLoading}
                    onClick={handleSubmit}
                >
                    동의하고 회원가입
                </Button>
            </div>
            
        </div>
    );
}