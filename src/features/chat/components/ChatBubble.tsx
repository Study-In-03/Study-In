import { useState } from 'react';
import CrownIcon from '@/assets/base/icon-crown-fill.svg?react';
import CopyIcon from '@/assets/base/icon-copy.svg?react';
import CheckIcon from '@/assets/base/icon-square-Check.svg?react';
import EmptyProfileIcon from '@/assets/base/icon-empty-profile.svg?react';
import { getFullUrl } from '@/api/upload';
import { ChatMessage } from '@/types/chat';

interface ChatBubbleProps {
    message: ChatMessage; // 더미 props 대신 API 메시지 객체를 통째로 받음
    isMine: boolean;      // 내 메시지 여부는 부모에서 판단하여 전달
    isOwner?: boolean;    // 스터디장 여부
}

export default function ChatBubble({ message, isMine, isOwner }: ChatBubbleProps) {

    // 메시지 객체가 없을 경우를 대비한 안전 장치
    if (!message) return null;
    
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    // API 데이터 매핑
    // 옵셔널 체이닝(?.)을 사용하여 데이터가 없을 때 터지는 것 방지
    // 시스템 메시지일 경우 user가 null일 수 있으므로 기본값 설정
    const sender = message.user?.profile?.nickname || "알 수 없는 사용자"; 
    const profileImg = message.user?.profile?.profile_img || null;
    const text = message.message || ""; // 텍스트 내용

    // 시간 포맷팅 (ISO 8601 -> 오전/오후 HH:MM)
    const time = message.created 
        ? new Date(message.created).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
        : "시간 정보 없음";

    // [API 연동] 텍스트 내용에 특정 키워드가 포함되면 코드로 간주 (디자인 유지용)
    const isCode = text.includes('def ') || text.includes('import ') || text.includes('class ');

    const limit = isCode ? 150 : 100;
    const isLongText = text.length > limit;
    const displayedText = isLongText && !isExpanded ? text.slice(0, limit) + "..." : text;

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={`flex w-full mb-5 gap-3 ${isMine ? 'justify-end' : 'justify-start'}`}>
            
            {/* 상대방 프로필 이미지 */}
            {!isMine && (
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center shrink-0 border border-gray-300 shadow-sm">
                    {profileImg ? (
                        <img 
                            src={getFullUrl(profileImg)} 
                            alt={`${sender} 프로필`} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <EmptyProfileIcon className="w-full h-full" />
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                
                {/* 이름 및 시간 */}
                {!isMine && (
                    <div className="flex items-center mb-1 gap-2">
                        <span className="text-sm text-gray-700 font-regular gap-1">{sender}</span>
                        {isOwner && (
                            <CrownIcon className="w-4 h-4 text-warning shrink-0" />
                        )}
                        <span className="text-xs text-gray-500">{time}</span>
                    </div>
                )}

                <div className={`flex items-end gap-1 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {isMine && (
                        <span className="text-xs text-gray-500 mb-1 shrink-0">
                            {time}
                        </span>
                    )}
                    {/* 말풍선 본문 */}
                    <div>
                        {/* 이미지 타입인 경우 */}
                        {message.chat_type === 'image' && message.image_url ? (
                            <div className="max-w-[440px] rounded-[8px] overflow-hidden">
                                <img 
                                    src={getFullUrl(message.image_url)} 
                                    alt="채팅 이미지" 
                                    className="w-full h-auto"
                                />
                            </div>
                        ) : message.chat_type === 'file' && message.file_url ? (
                            /* 파일 타입인 경우 (수정 필요) */
                            <a 
                                href={message.file_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="flex items-center gap-2 p-3 bg-gray-100 rounded-[8px] border border-gray-300 hover:bg-gray-200 transition-colors"
                            >
                                <span className="text-sm font-medium text-surface">
                                    📁 {message.file_url.split('/').pop() || '파일 다운로드'}
                                </span>
                            </a>
                        ) : isCode ? (
                            /* 코드형 텍스트 메시지 (수정 필요) */
                            <div className="bg-gray-700 rounded-[8px] p-3 w-full max-w-[306px] md:max-w-full overflow-hidden">
                                <div className="group">
                                    <div className="flex justify-between items-center ">
                                        <span className="text-background text-sm font-regular uppercase tracking-wider mb-1">message-code</span>
                                        <button 
                                            onClick={handleCopy} 
                                            className="mb-1 text-gray-500 hover:text-background transition-colors"
                                        >
                                            {copied ? <CheckIcon className="w-4 h-4"/> : <CopyIcon className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <pre className="text-base leading-relaxed font-regular whitespace-pre-wrap break-all text-background">
                                        {displayedText}
                                    </pre>
                                    {isLongText && (
                                        <button 
                                            onClick={() => setIsExpanded(!isExpanded)}
                                            className="text-base font-medium text-gray-500 hover:text-background transition-colors underline"
                                        >
                                            {isExpanded ? '접기' : '...더보기'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            /* 일반 텍스트 메시지 */
                            <div className={`bg-gray-100`}>
                                <p className={`text-base font-regular leading-snug break-all ${text.includes('http') ? 'text-primary underline' : ''}`}>
                                    {displayedText}
                                </p>
                                {isLongText && (
                                    <button 
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className={`text-base font-medium underline mt-1 text-gray-500 hover:text-gray-700`}
                                    >
                                        {isExpanded ? '접기' : '...더보기'}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}