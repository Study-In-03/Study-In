import React, { useEffect } from 'react';
import ChatBubble from './ChatBubble';
import SystemMessage from './SystemMessage';
import { useChatHistory } from '../hooks/useChatHistory'; 
import { useAuthStore } from '@/store/authStore'; 
import { axiosInstance } from '@/api/axios';

interface ChatMessageListProps {
    studyPk: number; 
}

export default function ChatMessageList({ studyPk }: ChatMessageListProps) {
    
    // 커스텀 훅을 통해 실제 API 데이터와 스크롤 Ref 가져옴
    const { messages, isLoading, scrollRef } = useChatHistory(studyPk);
    const { user: me, setUser } = useAuthStore(); // 로그인한 내 정보를 가져옴

    // 내 정보(PK)가 스토어에 없다면 새로 가져옴
    useEffect(() => {
        if (!me && studyPk) {
            axiosInstance.get('/accounts/user/') // 내 정보 조회 API 
                .then(res => setUser(res.data))
                .catch(err => console.error("유저 정보를 불러오지 못했습니다.", err));
        }
    }, [me, setUser, studyPk]);

    // 로딩 중일 때 처리 (Spinner가 없으므로 텍스트로 대체)
    if (isLoading) {
        return <div className="flex-1 flex items-center justify-center text-gray-500">채팅 내역을 불러오는 중...</div>;
    }

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col-reverse"
        >
            {/* 데이터가 아예 없을 경우 */}
            {messages.length === 0 && (
                <div className="text-center text-gray-500 py-10 text-base font-regular">
                    아직 대화 내용이 없습니다.
                </div>
            )}

            {/* API 메시지 리스트 매핑 */}
            {messages.map((msg, index) => {
                // 1날짜 구분선 로직 (이전 메시지와 날짜가 다를 때만 표시)
                const prevMsg = messages[index - 1];
                const showDate = !prevMsg || 
                    new Date(prevMsg.created).toDateString() !== new Date(msg.created).toDateString();

                return (
                    <React.Fragment key={msg.pk}>
                        {/* 날짜 구분선 연동 */}
                        {showDate && (
                            <SystemMessage 
                                type="date" 
                                content={new Date(msg.created).toLocaleDateString('ko-KR', {
                                    year: 'numeric', month: 'long', day: 'numeric'
                                })} 
                            />
                        )}

                        {/* 시스템 공지 혹은 일반 메시지 분기 */}
                        {msg.chat_type === 'notice' ? (
                            <SystemMessage type="notice" content={msg.message || ''} />
                        ) : (
                            <ChatBubble 
                                message={msg} 
                                isMine={msg.user?.pk === me?.pk} 
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}