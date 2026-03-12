import React from 'react';
import ChatBubble from './ChatBubble';
import SystemMessage from './SystemMessage';
import { useChatHistory } from '../hooks/useChatHistory';
import { storage } from '@/utils/storage';

interface ChatMessageListProps {
    studyPk: number;
    leaderId?: number;   
    onSendReady?: (sendMessage: (content: string, type: 'text' | 'image' | 'file') => void) => void;
}

export default function ChatMessageList({ studyPk, leaderId, onSendReady }: ChatMessageListProps) {
    const { messages, isLoading, scrollRef, sendMessage } = useChatHistory(studyPk);

    // number로 변환 — string이면 === 비교 시 항상 false가 되어 내 메시지가 상대방으로 표시됨
    const myPk = Number(storage.getUserId());

    // sendMessage를 부모(Chat.tsx)로 전달
    React.useEffect(() => {
        if (onSendReady) onSendReady(sendMessage);
    }, [sendMessage, onSendReady]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center text-gray-500">
                채팅 내역을 불러오는 중...
            </div>
        );
    }

    return (
        <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col"
        >
            {messages.length === 0 && (
                <div className="text-center text-gray-500 py-10 text-base font-regular">
                    아직 대화 내용이 없습니다.
                </div>
            )}

            {messages.map((msg, index) => {
                const prevMsg = messages[index - 1];
                const showDate =
                    !prevMsg ||
                    new Date(prevMsg.created).toDateString() !==
                        new Date(msg.created).toDateString();

                return (
                    <React.Fragment key={msg.pk}>
                        {showDate && (
                            <SystemMessage
                                key={`date-${msg.pk}`}
                                type="date"
                                content={new Date(msg.created).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            />
                        )}
                        {msg.chat_type === 'notice' ? (
                            <SystemMessage type="notice" content={msg.message || ''} />
                        ) : (
                            <ChatBubble
                                message={msg}
                                isMine={msg.user?.pk === myPk}
                                isOwner={msg.user?.pk === leaderId}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}