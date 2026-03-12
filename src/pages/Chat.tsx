import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getParticipatingStudies } from '@/api/study';
import { leaveStudy } from '@/api/study';
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
    const navigate = useNavigate();
    const [hasStudy, setHasStudy] = useState<boolean | null>(null);
    const [participatingCount, setParticipatingCount] = useState(0);
    const [studyStatus, setStudyStatus] = useState<string>('');
    const [leaderId, setLeaderId] = useState<number | undefined>();
    const [isRoomListOpen, setIsRoomListOpen] = useState(false);
    const [isMemberSidebarOpen, setIsMemberSidebarOpen] = useState(false);

    // ChatMessageList에서 올라온 sendMessage를 저장
    const sendMessageRef = useRef<((content: string, type: 'text' | 'image' | 'file') => void) | null>(null);

    useEffect(() => {
        if (isLoggedIn) {
            getParticipatingStudies()
                .then((studies) => {
                    setHasStudy(studies.length > 0);
                    const current = studies.find((s: any) => String(s.id) === study_pk);
                    if (current) {
                        setStudyStatus(current.study_status?.name ?? '');
                        setLeaderId(current.leader?.id);
                    }
                })
                .catch(() => setHasStudy(false));
        }
    }, [isLoggedIn, study_pk]);

    // 실제 데이터 존재 여부 판별
    const isNoData = !isLoggedIn || (hasStudy !== null && hasStudy === false);
    const isNoRoomSelected = isLoggedIn && !study_pk; // 로그인은 됐지만 채팅방 미선택
    const isChatLoading = isLoggedIn && hasStudy === null && !!study_pk;

    // ChatMessageList가 준비되면 sendMessage를 ref에 저장
    const handleSendReady = useCallback(
        (fn: (content: string, type: 'text' | 'image' | 'file') => void) => {
            sendMessageRef.current = fn;
        },
        []
    );

    // ChatInput → 웹소켓 전송
    const handleSendMessage = useCallback(
        (content: string, type: 'text' | 'image' | 'file' = 'text') => {
            if (sendMessageRef.current) {
                sendMessageRef.current(content, type);
            }
        },
        []
    );

    const handleLeaveStudy = useCallback(async () => {
        if (!study_pk || !window.confirm("정말 이 스터디를 나가시겠습니까?")) return;
        try {
            await leaveStudy(Number(study_pk));
            alert("스터디 탈퇴가 완료되었습니다.");
            navigate('/');
        } catch (error: any) {
            alert(error.response?.data?.error || "스터디 탈퇴에 실패했습니다.");
        }
    }, [study_pk, navigate]);

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

                {/* 왼쪽 사이드바: 스터디 없거나 로그인 안 됐을 때 숨김 */}
                <aside className={`${isNoData ? 'hidden' : 'hidden md:flex'} flex-col w-[calc((100vw-1190px)/2)] min-w-[200px] max-w-[300px] border-r border-gray-300 bg-background overflow-hidden shrink-0`}>
                    <div className="h-[50px] flex items-center justify-between px-4 border-b border-gray-300 shrink-0">
                        <ChatHeader
                            title={undefined}
                            statusName={studyStatus}
                            isRoomListOpen={isRoomListOpen}
                            onBack={() => setIsRoomListOpen(true)}
                            onToggleSidebar={() => setIsMemberSidebarOpen(!isMemberSidebarOpen)}
                            participatingCount={participatingCount}
                            onLeave={handleLeaveStudy}
                            slot="left"
                        />
                    </div>
                    <ChatRoomList />
                </aside>

                {/* 가운데 채팅 영역 */}
                <main className={`flex-1 min-w-0 flex flex-col overflow-x-hidden md:bg-gray-100 ${isNoData ? 'bg-background' : 'bg-gray-100'}`}>
                    <div className="relative shrink-0">
                        <ChatHeader
                            title={!isNoData && !isNoRoomSelected ? "스터디 채팅방" : undefined}
                            statusName={studyStatus}
                            isRoomListOpen={isRoomListOpen}
                            onBack={() => setIsRoomListOpen(true)}
                            onToggleSidebar={() => setIsMemberSidebarOpen(!isMemberSidebarOpen)}
                            onLeave={handleLeaveStudy}
                            slot="center"
                        />
                    </div>
                    {isChatLoading ? (
                        <div className="flex-1 flex items-center justify-center text-gray-500 text-base font-regular">
                            로딩 중...
                        </div>
                    ) : isNoData ? (
                        <ChatEmptyState isLoggedIn={isLoggedIn} />
                    ) : isNoRoomSelected ? (
                        <>
                            {/* 모바일: 상단 바 */}
                            <div className="md:hidden h-[50px] flex items-center justify-between w-full px-4 border-b border-gray-300 shrink-0 bg-background">
                                <h2 className="text-sm font-medium text-surface">
                                    참여 중인 스터디 <span className="text-surface">-</span> <span className="text-primary font-bold">{participatingCount}개</span>
                                </h2>
                                <button className="text-gray-500 hover:text-primary-light transition-colors">
                                    <ImportIcon className="w-[21px] h-[21px]" />
                                </button>
                            </div>
                            {/* 모바일: 스터디 목록 바로 표시 */}
                            <div className="flex-1 overflow-y-auto md:hidden">
                                <ChatRoomList onCountChange={setParticipatingCount} />
                            </div>
                            {/* 데스크탑: 회색 배경만 */}
                            <div className="hidden md:flex flex-1" />
                        </>
                    ) : (
                        <>
                            <ChatMessageList
                                studyPk={Number(study_pk)}
                                leaderId={leaderId}
                                onSendReady={handleSendReady}
                            />
                            <ChatInput onSendMessage={handleSendMessage} />
                        </>
                    )}
                </main>

                {/* 오른쪽 사이드바: 스터디 없거나 로그인 안 됐거나 방 미선택 시 데스크탑에서 숨김 */}
                <aside className={`
                    fixed top-[56px] right-0 bottom-0 z-[70]
                    ${!isNoData && !isNoRoomSelected ? 'md:relative md:top-0 md:flex md:flex-col' : 'md:hidden'}
                    w-[280px] md:w-[calc((100vw-1190px)/2)] md:min-w-[200px] md:max-w-[300px]
                    bg-background border-l border-gray-300 transition-transform duration-300 shrink-0
                    ${isMemberSidebarOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}
                `}>
                    <ChatSidebar onClose={() => setIsMemberSidebarOpen(false)} onLeave={handleLeaveStudy} />
                </aside>
            </div>
        </div>
    );
}
