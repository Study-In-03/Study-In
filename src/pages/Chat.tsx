import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getParticipatingStudies } from '@/api/study';
import ChatHeader from '@/features/chat/components/ChatHeader';
import ChatEmptyState from '@/features/chat/components/ChatEmptyState';
import ChatInput from '@/features/chat/components/ChatInput';
import ChatMessageList from '@/features/chat/components/ChatMessageList';
import ChatRoomList from '@/features/chat/components/ChatRoomList';
import ChatSidebar from '@/features/chat/components/ChatSidebar';
import ImportIcon from '@/assets/base/icon-square-empty.svg?react';

export default function Chat() {
    const { study_pk } = useParams();
    const { isLoggedIn } = useAuthStore();
    const [hasStudy, setHasStudy] = useState<boolean | null>(null);
    const [participatingCount, setParticipatingCount] = useState(0);

    const [isRoomListOpen, setIsRoomListOpen] = useState(false);
    const [isMemberSidebarOpen, setIsMemberSidebarOpen] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            getParticipatingStudies()
                .then((studies) => setHasStudy(studies.length > 0))
                .catch(() => setHasStudy(false));
        }
    }, [isLoggedIn]);

    // 실제 데이터 존재 여부 판별
    const isNoData = !isLoggedIn || (hasStudy !== null && hasStudy === false) || !study_pk;

    // WebSocket URL: wss://api.wenivops.co.kr/services/studyin-chat/chat/study/{study_pk}/?token={jwt}
    // 메시지 포맷: { type: "text" | "image" | "file", message: string }
    // 현재는 컴포넌트 구조만 유지하고 실제 WebSocket 연결은 ChatMessageList/ChatInput 내부에서 처리
    const handleSendMessage = (content: string, type: 'text' | 'image' | 'file' = 'text') => {
        console.log(`전송할 메시지 (${type}):`, content);
        // TODO: WebSocket 전송 로직
        // ws.send(JSON.stringify({ type, message: content }))
    };

    return (
        <div className="relative flex flex-col h-[calc(100vh-56px)] md:h-[calc(100vh-80px)] bg-background md:bg-transparent overflow-x-hidden">

            {/* 모바일: 채팅방 목록 풀페이지 */}
            {isRoomListOpen && (
                    <div className="fixed inset-0 top-[106px] md:hidden z-[70] bg-background">
                        <ChatRoomList 
                            onClose={() => setIsRoomListOpen(false)} 
                            onCountChange={setParticipatingCount}/>
                    </div>
            )}

            {isMemberSidebarOpen && (
                <div 
                    className="fixed inset-0 top-[56px] bg-black/30 z-[65] md:hidden"
                    onClick={() => setIsMemberSidebarOpen(false)}
                />
            )}

            {/* 모바일: 채팅방 목록일 때 헤더 */}
            {isRoomListOpen && (
                <div className="md:hidden h-[50px] flex items-center justify-between w-full px-4 border-b border-gray-300 shrink-0 bg-background relative z-[80]">
                    <h2 className="text-base font-medium text-surface">
                        참여 중인 스터디 - <span className="text-primary font-bold">{participatingCount}개</span>
                    </h2>
                    <button className="text-gray-500 hover:text-primary-light transition-colors">
                        <ImportIcon className="w-[21px] h-[21px]" />
                    </button>
                </div>
            )}
            {/* 채팅 본체 */}
            <div className={`flex-1 min-h-0 flex ${isRoomListOpen ? 'hidden md:flex' : 'flex'}`}>

                {/* 왼쪽 사이드바 */}
                <aside className="hidden md:flex flex-col w-[calc((100vw-1190px)/2)] min-w-[200px] max-w-[300px] border-r border-gray-300 bg-background overflow-hidden shrink-0">
                    <div className="h-[50px] flex items-center justify-between px-4 border-b border-gray-300 shrink-0">
                        <ChatHeader
                            studyPk={Number(study_pk)}
                            title={undefined}
                            statusName="진행 중"
                            isRoomListOpen={isRoomListOpen}
                            onBack={() => setIsRoomListOpen(true)}
                            onToggleSidebar={() => setIsMemberSidebarOpen(!isMemberSidebarOpen)}
                            participatingCount={participatingCount}
                            slot="left"
                        />
                    </div>
                    <ChatRoomList />
                </aside>

                {/* 가운데 채팅 영역 */}
                <main className={`flex-1 min-w-0 flex flex-col overflow-hidden md:bg-gray-100 ${isNoData ? 'bg-background' : 'bg-gray-100'}`}>
                    <div className="relative shrink-0">
                        <ChatHeader
                            studyPk={Number(study_pk)}
                            title={!isNoData ? "스터디 채팅방" : undefined}
                            statusName="진행 중"
                            isRoomListOpen={isRoomListOpen}
                            onBack={() => setIsRoomListOpen(true)}
                            onToggleSidebar={() => setIsMemberSidebarOpen(!isMemberSidebarOpen)}
                            slot="center"
                        />
                    </div>
                    {isNoData ? (
                        <ChatEmptyState isLoggedIn={isLoggedIn} />
                    ) : (
                        <>
                            <ChatMessageList studyPk={Number(study_pk)} />
                            <ChatInput onSendMessage={handleSendMessage} />
                        </>
                    )}
                </main>

                {/* 오른쪽 사이드바 */}
                <aside className={`
                    fixed top-[56px] right-0 bottom-0 z-[70]
                    md:relative md:top-0 md:flex md:flex-col
                    w-[280px] md:w-[calc((100vw-1190px)/2)] md:min-w-[200px] md:max-w-[300px]
                    bg-background border-l border-gray-300 transition-transform duration-300 shrink-0
                    ${isMemberSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    <ChatSidebar onClose={() => setIsMemberSidebarOpen(false)} />
                </aside>
            </div>
        </div>
    );
}
