import { useState } from 'react';
import personIcon from '@/assets/base/icon-person.svg'; 
import CrownIcon from '@/assets/base/icon-crown-fill.svg?react';
import CopyIcon from '@/assets/base/icon-copy.svg?react';
import CheckIcon from '@/assets/base/icon-square-Check.svg?react';
import { getFullUrl } from '@/api/upload';

interface ChatBubbleProps {
    isMine: boolean;
    sender: string;
    time: string;
    text: string;
    profileImg?: string | null;
    isCode?: boolean;
    isOwner?: boolean; 
}

export default function ChatBubble({ isMine, sender, time, text, profileImg, isCode, isOwner }: ChatBubbleProps) {
    const [copied, setCopied] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const limit = isCode ? 150 : 100; 
    const isLongText = text.length > limit;

    const displayedText = isLongText && !isExpanded 
        ? text.slice(0, limit) + "..." 
        : text;

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
                            className="object-cover" 
                        />
                    ) : (
                        <img 
                            src={personIcon} 
                            alt="기본 프로필" 
                            className= "opacity-40" 
                        />
                    )}
                </div>
            )}

            <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                
                {/* 이름 및 시간 */}
                {!isMine && (
                    <div className="flex items-center mb-1 gap-1">
                        <span className="text-sm text-gray-700 font-regular">{sender}</span>
                        {isOwner && (
                            <CrownIcon className="w-4 h-4 text-warning shrink-0" />
                        )}
                        <span className="text-xs text-gray-500">{time}</span>
                    </div>
                )}

                <div>
                    {isMine && (
                        <span className="text-xs text-gray-500 mb-1 shrink-0">
                            {time}
                        </span>
                    )}

                    {/* 말풍선 본문 */}
                    <div>
                        {isCode ? (
                            <div className="bg-gray-700 rounded-[8px] p-3 w-full max-w-[306px] md:max-w-full overflow-hidden">
                                <div className="group">
                                    <div className="flex justify-between items-center ">
                                        <span className="text-background text-sm font-regular uppercase tracking-wider mb-1">message-code</span>
                                        <button 
                                            onClick={handleCopy} 
                                            className="mb-1 text-gray-500 hover:text-background transition-colors"
                                        >
                                            {copied ? (
                                                <CheckIcon className="w-4 h-4"/>
                                            ) : (
                                                <CopyIcon className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                    <pre className="text-base leading-relaxed font-regular whitespace-pre-wrap break-all text-background">
                                        {displayedText}
                                    </pre>
                                    {/* 코드용 더보기 버튼 */}
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
                            <div>
                            <p className={`text-base font-regular leading-snug break-all ${text.includes('http') ? 'text-primary underline' : 'text-surface'}`}>
                                {displayedText}
                            </p>
                            {/* 텍스트용 더보기 버튼 */}
                            {isLongText && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-base font-medium text-gray-500 hover:text-background transition-colors underline"
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