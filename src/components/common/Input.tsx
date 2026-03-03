import { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    errorMessage?: string;
    variant?: 'default' | 'auth';
}

export default function Input({
    errorMessage,
    variant = 'auth', // 로그인 화면에서 사용 위해 auth = 기본값
    className = '',
    ...props
}: InputProps) {
    
    // default (메인 페이지에 사용할 input) 추가 예정
    if (variant === 'default') {
        return <input className={className} {...props} />;
    }

    return (
        <div className="w-full flex flex-col">
            <input
                {...props}
                className={`w-full max-w-[322px] border-b-2 py-3 text-base placeholder:text-gray-500 focus:outline-none transition-colors ${
                    errorMessage
                        ? 'border-error'
                        : 'border-gray-300 focus:border-primary'
                } ${className}`}
            />
            {errorMessage && (
                <p className="text-error text-xs mt-[6px]">{errorMessage}</p>
            )}
        </div>
    );
}