import { useNavigate } from 'react-router-dom';

interface ChatEmptyStateProps {
    isLoggedIn: boolean;
}

export default function ChatEmptyState({ isLoggedIn }: ChatEmptyStateProps) {
    const navigate = useNavigate();

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-lg mb-[30px] font-medium text-center">
                {!isLoggedIn ? "채팅방은 로그인 후 입장 가능합니다." : "아직 참여하고 있는 스터디가 없어요."}
            </p>
            <button 
                onClick={() => navigate(!isLoggedIn ? '/login' : '/')}
                className="shrink-0 w-full max-w-[250px] h-[50px] bg-primary text-background text-lg font-medium rounded-[8px] hover:bg-primary-light transition-colors"
            >
                {!isLoggedIn ? "로그인" : "스터디 둘러보기"}
            </button>
        </div>
    );
}