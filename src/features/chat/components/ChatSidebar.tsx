import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CrownIcon from '@/assets/base/icon-crown-fill.svg?react';
import DotsIcon from '@/assets/base/icon-dots.svg?react';
import HomeIcon from '@/assets/base/icon-Home.svg?react';

interface ChatSidebarProps {
    onClose?: () => void;
}

export default function ChatSidebar({ onClose }: ChatSidebarProps) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="h-[50px] px-4 flex items-center justify-between border-b border-gray-300 shrink-0 bg-background">
                <h2 className="text-base font-medium text-surface">
                    스터디원 - <span className="text-primary font-bold">5명</span>
                </h2>
                <div className="relative">
                    <button className="text-gray-500 hover:text-primary-light transition-colors"
                    onClick={(e) => {
                            e.stopPropagation();
                            setIsMenuOpen(!isMenuOpen);
                        }}
                >
                    <DotsIcon className="w-6 h-6" />
                </button>

                {isMenuOpen && (
                        <div className="md:hidden">
                            <div 
                                className="fixed inset-0 bg-transparent z-40" 
                                onClick={() => setIsMenuOpen(false)} 
                            />
                            
                            <div className="absolute right-0 mt-1 w-[200px] bg-background border border-gray-300 rounded-[10px] shadow-lg px-2 py-[9px] z-50 animate-in fade-in zoom-in duration-200">
                                <button 
                                    className="w-[184px] text-left px-[10px] py-[5px] text-base font-regular rounded-[8px] text-surface hover:bg-gray-100"
                                    onClick={() => { /* 알림 설정 로직 */ setIsMenuOpen(false); }}
                                >
                                    채팅방 알림 끄기
                                </button>
                                <button 
                                    className="w-[184px] text-left px-[10px] py-[5px] text-base font-regular rounded-[8px] text-error mt-1 hover:bg-gray-100"
                                    onClick={() => { /* 나가기 로직 */ setIsMenuOpen(false); }}
                                >
                                    스터디 나가기
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* 스터디장 */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[42px] bg-gray-300" />
                    <span className="text-base font-medium text-surface">주커버그 사촌동생</span>
                    <CrownIcon className="w-5 h-5" />
                </div>

                {/* 일반 멤버 */}
                {['로봇마술사사종사촌', '빙키', '재미봉봉', '개조당한 로봇 캣'].map((name) => (
                    <div key={name} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[42px] bg-gray-300" />
                        <span className="text-base font-regular text-surface">{name}</span>
                    </div>
                ))}
            </div>

            <div className="md:hidden absolute bottom-0 left-0 right-0 h-[50px] border-t border-gray-300 p-[13px] flex items-center justify-end">
                <button 
                    onClick={() => navigate('/')}
                    className="flex text-gray-500 hover:text-primary-light transition-colors"
                >
                    <HomeIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}