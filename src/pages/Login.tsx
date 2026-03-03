import { Link } from 'react-router-dom';
import loginIllustration from '@/assets/login-illustration.png';
import LoginForm from '@/features/auth/components/LoginForm'

export default function Login() {
    return (
        <div className="flex flex-col items-center justify-center w-full px-4 py-12">

            <h2 className="text-2xl font-bold text-gray-900 text-left leading-[1.6] mt-[52px] mb-5">
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
                <span className="w-[1px] h-3 bg-gray-700"></span> {/* 구분선(|) */}
                <Link to="/forgot-password" className="hover:text-primary-light transition-colors">비밀번호 찾기</Link>
            </div>

        </div>
    );
}