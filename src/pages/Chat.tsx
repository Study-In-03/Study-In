import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { axiosInstance } from '@/api/axios';
import ChatHeader from '@/features/chat/components/ChatHeader';
import ChatEmptyState from '@/features/chat/components/ChatEmptyState';
import ChatInput from '@/features/chat/components/ChatInput';
import ChatMessageList from '@/features/chat/components/ChatMessageList';
import ChatRoomList from '@/features/chat/components/ChatRoomList';
import ChatSidebar from '@/features/chat/components/ChatSidebar';

export default function Chat() {
    const { study_pk } = useParams();
    const { isLoggedIn } = useAuthStore();
    const [hasStudy, setHasStudy] = useState<boolean | null>(null);

    const [isRoomListOpen, setIsRoomListOpen] = useState(false);
    const [isMemberSidebarOpen, setIsMemberSidebarOpen] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            axiosInstance.get('/study/my-participating-study/')
                .then((res) => setHasStudy(res.data.length > 0))
                .catch(() => setHasStudy(false));
        }
    }, [isLoggedIn]);

    // 실제 데이터 존재 여부 판별
    const isNoData = !isLoggedIn || hasStudy === false || !study_pk;

    // 메시지 전송 로직 (WebSocket 연결 시 이 함수를 통해 메시지를 보냄)
    const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
        console.log(`전송할 메시지 (${type}):`, content);
        // 여기에 WebSocket 전송 로직이 들어감
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-56px)] md:h-[calc(100vh-80px)] bg-background md:bg-transparent overflow-x-hidden">

            {/* ChatHeader */}
            <div className="relative z-[40]">
                <ChatHeader 
                    studyPk={Number(study_pk)} // 🟢 추가
                    title={!isNoData ? "스터디 채팅방" : undefined} 
                    statusName="진행 중"
                    isRoomListOpen={isRoomListOpen}
                    onBack={() => setIsRoomListOpen(true)}
                    onToggleSidebar={() => setIsMemberSidebarOpen(!isMemberSidebarOpen)}
                />
            </div>

            {/* 모바일: 채팅방 목록 풀페이지 */}
            {isRoomListOpen && (
                    <div className="fixed inset-0 top-[106px] md:hidden z-[70] bg-background">
                        <ChatRoomList onClose={() => setIsRoomListOpen(false)} />
                    </div>
            )}

            {isMemberSidebarOpen && (
                <div 
                    className="fixed inset-0 top-[56px] bg-black/30 z-[65] md:hidden"
                    onClick={() => setIsMemberSidebarOpen(false)}
                />
            )}

            {/* 채팅 본체 */}
            <div className={`flex-1 min-h-0 relative ${isRoomListOpen ? 'hidden md:block' : 'block'}`}>

                {/* 왼쪽 사이드바 */}
                <aside className=" hidden md:flex flex-col absolute top-0 left-0 bottom-0 w-[calc((100vw-1190px)/2)] min-w-[200px] border-r border-gray-300 bg-background overflow-hidden z-10">
                    <ChatRoomList />
                </aside>

                {/* 가운데 채팅 영역 */}
                <main className={`
                    h-full flex flex-col overflow-hidden
                    md:max-w-[1190px] md:mx-auto
                    ${isNoData ? 'bg-background' : 'bg-gray-100'}
                `}>
                    {isNoData ? (
                        <ChatEmptyState isLoggedIn={isLoggedIn} />
                    ) : (
                        <>
                            <ChatMessageList studyPk={Number(study_pk)} />
                            <ChatInput onSendMessage={handleSendMessage} />
                        </>
                    )}
                </main>

                {/* 모바일: 스터디원 사이드바 */}
                <aside className={`
                    fixed top-[56px] right-0 bottom-0 z-[70]
                    md:absolute md:top-[-50px] md:right-0 md:h-[calc(100%+50px)] md:z-[60]
                    md:flex md:flex-col
                    w-[280px] md:w-[calc((100vw-1190px)/2)] md:min-w-[290px]
                    bg-background border-l border-gray-300 transition-transform duration-300
                    ${isMemberSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    <ChatSidebar onClose={() => setIsMemberSidebarOpen(false)} />
                </aside>
                
            </div>
        </div>
    );
}