import ChatBubble from './ChatBubble';
import SystemMessage from './SystemMessage';

interface Message {
    id: number;
    isMine: boolean;
    sender: string;
    time: string;
    text: string;
    isCode?: boolean;
    isOwner?: boolean;
    profileImg?: string | null;
}

interface ChatMessageListProps {
    messages: Message[];
}

export default function ChatMessageList({ messages }: ChatMessageListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse">
            <div className="flex flex-col gap-2">
                {/* 날짜 및 공지사항 영역 */}
                <SystemMessage type="date" content="2022년 3월 22일" />
                <SystemMessage type="notice" content="빙키님이 참여했어요!" />
                <SystemMessage type="notice" content="개조당한 로봇 캣님이 참여했어요!" isLastNotice={true} />

                {/* 메시지 리스트 */}
                {messages.map((msg) => (
                    <ChatBubble key={msg.id} {...msg} />
                ))}
            </div>
        </div>
    );
}