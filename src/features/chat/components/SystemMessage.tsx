interface SystemMessageProps {
    type: 'date' | 'notice';
    content: string | null;
}

export default function SystemMessage({ type, content }: SystemMessageProps) {
    // 데이터가 없을 경우 렌더링 방지
    if (!content) return null;

    if (type === 'date') {
        // 날짜 구분선
        return (
            <div className="flex justify-center mt-20 mb-2">
                <span className="bg-gray-300 text-gray-700 text-sm font-regular px-[13px] py-[5px] rounded-[26px]">
                    {content}
                </span>
            </div>
        );
    }

    // 시스템 알림
    return (
        <div className={`flex justify-center mb-1`}>
            <div className="bg-background border border-primary text-primary text-sm font-regular px-[13px] py-[5px] rounded-[26px]">
                <span>📢</span>
                <span>{content}</span>
            </div>
        </div>
    );
}