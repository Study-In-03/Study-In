import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { axiosInstance } from '@/api/axios';
import ChatHeader from '@/features/chat/components/ChatHeader';
import ChatEmptyState from '@/features/chat/components/ChatEmptyState';
import ChatInput from '@/features/chat/components/ChatInput';
import ChatMessageList from '@/features/chat/components/ChatMessageList';
import ChatRoomList from '@/features/chat/components/ChatRoomList';
import ChatSidebar from '@/features/chat/components/ChatSidebar';

export default function Chat() {
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

    // const isNoData = !isLoggedIn || hasStudy === false;
    const isNoData = false;

    // 테스트용 메시지 데이터 (시안 반영)
    const mockMessages = [
        {
            id: 1,
            isMine: false,
            sender: "주커버그사촌동생",
            time: "오후 12:03",
            text: "안녕하세요! 이번 스터디에서 진행할 파이썬 알고리즘 문제 풀이 공지드립니다. 이번 주는 프로그래머스 레벨 2 단계의 '해시'와 '정렬' 파트를 집중적으로 풀어볼 예정이에요. 다들 미리 문제를 읽어보고 오시면 스터디 진행에 큰 도움이 될 것 같습니다. 혹시 어려운 점이 있다면 언제든 채팅방에 질문 남겨주세요! 우리 모두 파이팅해서 끝까지 완주해봅시다!",
            isOwner: true,
            profileImg: null
        },
        {
            id: 2,
            isMine: false,
            sender: "주커버그사촌동생",
            time: "오후 12:03",
            text: `def solution(numbers):
                        # 숫자를 문자열로 변환하여 정렬합니다. 
                        # 3, 30의 경우 330이 303보다 크므로 x*3을 기준으로 비교합니다.
                        numbers = list(map(str, numbers))
                        numbers.sort(key=lambda x: x*3, reverse=True)
    
                        # 모든 숫자가 0인 경우 '0'을 반환합니다.
                        answer = str(int(''.join(numbers)))
    
                        # 이 부분은 정렬 알고리즘의 핵심 로직을 설명하기 위한 주석입니다.
                        # 문자열 비교 연산은 사전순으로 진행되기 때문에 
                        # '3' > '30'과 같은 비교를 위해 길이를 맞춰주는 과정이 필요합니다.
                    return answer`,
            isCode: true,
            isOwner: true,
            profileImg: null
        },
        {
            id: 3,
            isMine: true,
            sender: "나",
            time: "오후 12:05",
            text: "오! 좋은 코드네요. 참고하겠습니다!",
            profileImg: null
        }
    ];

    return (
        <div className="relative flex flex-col h-[calc(100vh-56px)] md:h-[calc(100vh-80px)] bg-background md:bg-transparent overflow-x-hidden">

            {/* ChatHeader */}
            <div className="relative z-[40]">
                <ChatHeader 
                    title={!isNoData ? "8주 파이썬 정복하기" : undefined} 
                    statusName="진행 중"
                    isRoomListOpen={isRoomListOpen}
                    isMemberSidebarOpen={isMemberSidebarOpen}
                    onBack={() => setIsRoomListOpen(true)} // 채팅방 -> 목록으로 가기
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
                            <ChatMessageList messages={mockMessages} />
                            <ChatInput />
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