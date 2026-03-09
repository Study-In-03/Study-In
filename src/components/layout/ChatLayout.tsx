import { Outlet } from 'react-router-dom';
import Header from './Header';

export default function ChatLayout() {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            {/* 
                채팅 페이지는 전체 너비를 사용해야 하므로
                max-w, px 제한을 없애고 grow만 유지
            */}
            <main className="w-full grow overflow-hidden">
                <Outlet />
            </main>
        </div>
    );
}