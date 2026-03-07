interface ChatRoomListProps {
    onClose?: () => void;
}

export default function ChatRoomList({ onClose }: ChatRoomListProps) {
    return (
        <div className="flex flex-col h-full bg-background w-full overflow-hidden">

            {/* 스터디 목록 */}
            <div className="flex-1 overflow-y-auto">
                {[1, 2, 3, 4].map((i) => (
                    <div 
                        key={i} 
                        className="p-4 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-colors"
                        onClick={onClose} 
                    >
                        {/* 스터디 이미지 */}
                        <div className="w-[52px] h-[52px] rounded-[16px] bg-gray-300 shrink-0 flex items-center justify-center relative shadow-sm">
                            {/* 알림 표시용 파란 점 */}
                            <span className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-[8px]" />
                        </div>
                        
                        {/* 스터디 채팅방 목록 */}
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-base font-mediun text-surface truncate">
                                FastAPI 깊게 파 보실분~
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}