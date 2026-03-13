import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    variant?: 'default' | 'auth';
    children: React.ReactNode;
}

export default function Button({
    isLoading,
    disabled,
    variant = 'auth', // 로그인 화면에서 사용 위해 auth = 기본값
    className = '',
    children,
    ...props
}: ButtonProps) {
    // 로딩 중이거나 폼이 유효하지 않으면 버튼 비활성화
    const isDisabled = isLoading || disabled;

    // default (메인 페이지에 사용할 button) 추가 예정
    if (variant === 'default') {
        return (
            <button disabled={isDisabled} className={className} {...props}>
                {children}
            </button>
        );
    }

    return (
        <button
            disabled={isDisabled}
            {...props}
            className={`w-full max-w-[322px] font-medium text-lg py-4 rounded-lg transition-colors ${
                !isDisabled
                    ? 'bg-primary text-background hover:bg-primary-light cursor-pointer'
                    : 'bg-gray-300 text-background cursor-not-allowed'
            } ${className}`}
        >
            {isLoading ? '처리 중...' : children}
        </button>
    );
}