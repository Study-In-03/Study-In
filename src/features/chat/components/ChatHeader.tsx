import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STATUS_BG_COLOR } from '@/constants/study';
import LeftArrowIcon from '@/assets/base/icon-Left-arrow.svg?react';
import PeopleIcon from '@/assets/base/icon-people.svg?react';
import HomeIcon from '@/assets/base/icon-Home.svg?react';
import DotsIcon from '@/assets/base/icon-dots.svg?react';
import ImportIcon from '@/assets/base/icon-square-empty.svg?react';

interface ChatHeaderProps {
    title?: string;
    statusName?: string;
    onBack?: () => void;
    onToggleSidebar?: () => void;
    onLeave?: () => void;
    isRoomListOpen?: boolean;
    participatingCount?: number;
    slot?: 'left' | 'center';
}

const StudyStatusBadge = ({ status }: { status: string }) => {
    if (!status) return null;
    return (
        <span className={`mr-3 px-[10px] py-[3px] text-xs font-regular text-background rounded-[26px] shrink-0 ${STATUS_BG_COLOR[status] || 'bg-gray-700'}`}>
            {status}
        </span>
    );
};

export default function ChatHeader({
    title,
    statusName = '',
    onBack,
    onToggleSidebar,
    onLeave,            // 추가
    isRoomListOpen,
    participatingCount = 0,
    slot,
}: ChatHeaderProps) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleGoHome = () => navigate('/chat');

    if (slot === 'left') {
        return (
            <div className="flex items-center justify-between w-full h-full">
                <h2 className="text-base font-medium text-surface">
                    참여 중인 스터디 - <span className="text-primary font-bold">{participatingCount}개</span>
                </h2>
                <button className="text-gray-500 hover:text-primary-light transition-colors">
                    <ImportIcon className="w-[21px] h-[21px]" />
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-background shrink-0">
            <div className="flex items-stretch h-[50px]">

                {/* 모바일: 왼쪽 헤더 영역 (참여 스터디 개수) */}
                <div className={`
                    ${isRoomListOpen ? 'flex' : 'hidden'}
                    items-center justify-between px-4 w-full border-b border-gray-300 shrink-0
                `}>
                    <h2 className="text-base font-medium text-surface">
                        참여 중인 스터디 - <span className="text-primary font-bold">{participatingCount}개</span>
                    </h2>
                    <button className="text-gray-500 hover:text-primary-light transition-colors">
                        <ImportIcon className="w-[21px] h-[21px]" />
                    </button>
                </div>

                {/* 채팅방 제목 영역 */}
                <div className={`
                    ${!isRoomListOpen ? 'flex' : 'hidden'}
                    items-center justify-between w-full px-4 border-b border-gray-300
                `}>
                    {title ? (
                        <div className="flex items-center w-full justify-between">
                            <div className="flex items-center">
                                <button
                                    onClick={() => {
                                        if (window.innerWidth < 768 && onBack) {
                                            onBack();
                                        } else {
                                            handleGoHome();
                                        }
                                    }}
                                    className="mr-4 flex items-center justify-center"
                                >
                                    <LeftArrowIcon className="w-6 h-6 text-gray-500 hover:text-primary-light transition-colors md:hidden" />
                                    <HomeIcon className="w-6 h-6 text-gray-500 hover:text-primary-light transition-colors hidden md:block" />
                                </button>
                                <StudyStatusBadge status={statusName} />
                                <h2 className="text-base font-medium text-surface truncate max-w-[150px] md:max-w-none">
                                    {title}
                                </h2>
                            </div>
                            <div className="relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                                    className="ml-4 flex items-center justify-center"
                                >
                                    <PeopleIcon
                                        className="w-6 h-6 text-gray-500 hover:text-primary-light transition-colors md:hidden"
                                        onClick={onToggleSidebar}
                                    />
                                    <DotsIcon className=" w-6 h-6 text-surface hidden md:block" />
                                </button>
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-1 w-[200px] bg-background border border-gray-300 rounded-[10px] shadow-lg px-2 py-[9px] z-[80] animate-in fade-in zoom-in duration-200">
                                        <button
                                            className="w-[184px] text-left px-[10px] py-[5px] text-base font-regular rounded-[8px] text-surface hover:bg-gray-100"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            채팅방 알림 끄기
                                        </button>
                                        <button
                                            className="w-[184px] text-left px-[10px] py-[5px] text-base font-regular rounded-[8px] text-error mt-1 hover:bg-gray-100"
                                            onClick={() => { setIsMenuOpen(false); onLeave?.(); }}
                                        >
                                            스터디 나가기
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full" />
                    )}
                </div>
            </div>
        </div>
    );
}