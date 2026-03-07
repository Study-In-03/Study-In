import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftArrowIcon from '@/assets/base/icon-Left-arrow.svg?react';
import PeopleIcon from '@/assets/base/icon-people.svg?react';
import HomeIcon from '@/assets/base/icon-Home.svg?react'; 
import DotsIcon from '@/assets/base/icon-dots.svg?react';
import ImportIcon from '@/assets/base/icon-asset-import.svg?react';
import { axiosInstance } from '@/api/axios';

interface ChatHeaderProps {
    studyPk: number;
    title?: string; 
    statusName?: string;
    onBack?: () => void;
    onToggleSidebar?: () => void;
    isRoomListOpen?: boolean;
    leaderId?: number;
}

const StudyStatusBadge = ({ status }: { status: string }) => {
    const statusColors: Record<string, string> = {
        "모집 중": "bg-primary",      
        "진행 중": "bg-warning",   
        "마감": "bg-error",       
        "종료": "bg-gray-700",       
    };

    return (
        <span className={`mr-3 px-[10px] py-[3px] text-xs font-regular text-background rounded-[26px] shrink-0 ${statusColors[status] || 'bg-gray-700'}`}>
            {status}
        </span>
    );
};

export default function ChatHeader({ studyPk, title, statusName = "진행 중", onBack, onToggleSidebar, isRoomListOpen, leaderId }: ChatHeaderProps) {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [participatingCount, setParticipatingCount] = useState(0); // 참여 스터디 개수 상태
    const handleGoHome = () => navigate('/');

    // [API 연동] 참여 중인 스터디 목록 개수 가져오기
    useEffect(() => {
        const fetchParticipatingCount = async () => {
            try {
                const response = await axiosInstance.get('/study/my-participating-study/');
                setParticipatingCount(response.data.length || 0);
            } catch (error) {
                console.error("참여 스터디 목록을 가져오지 못했습니다.", error);
            }
        };
        fetchParticipatingCount();
    }, []);

    // [API 연동] 스터디 나가기 기능
    const handleLeaveStudy = async () => {
        if (!window.confirm("정말 이 스터디를 나가시겠습니까?")) return;

        try {
            // DELETE /study/{study_pk}/participate/
            await axiosInstance.delete(`/study/${studyPk}/participate/`);
            alert("스터디 탈퇴가 완료되었습니다.");
            navigate('/'); // 탈퇴 후 메인으로 이동
        } catch (error: any) {
            // 400 에러: 스터디장은 나갈 수 없음
            const errorMsg = error.response?.data?.error || "스터디 탈퇴에 실패했습니다.";
            alert(errorMsg);
        } finally {
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="w-full bg-background shrink-0">
            <div className="flex items-stretch h-[50px]">
                <div className={`
                    ${isRoomListOpen ? 'flex' : 'hidden md:flex'} 
                    items-center justify-between px-4 md:w-[calc((100vw-1190px)/2)] w-full md:min-w-[200px] border-r border-b border-gray-300 shrink-0
                `}>
                    <h2 className="text-base font-medium text-surface">
                        참여 중인 스터디 - <span className="text-primary font-bold">{participatingCount}개</span>
                    </h2>
                    <button className="text-gray-500 hover:text-primary-light transition-colors">
                        <ImportIcon className="w-[21px] h-[21px]" />
                    </button>
                </div>

                <div className={`
                    ${!isRoomListOpen ? 'flex' : 'hidden md:flex'} 
                    items-center justify-between w-full px-4 md:px-8 border-b border-gray-300
                `}>
                    {title ? (
                        <div className="flex items-center w-full justify-between">
                            <div className="flex items-center">
                                <button 
                                    onClick={(e) => {
                                        if (window.innerWidth < 768 && onBack) {
                                            onBack();
                                        } else {
                                            handleGoHome();
                                        }
                                    }} 
                                    className="mr-4 flex items-center justify-center"
                                >
                                    {/* 모바일용 뒤로가기 아이콘 */}
                                    <LeftArrowIcon className="w-6 h-6 text-gray-500 hover:text-primary-light transition-colors md:hidden" />
                                    
                                    {/* 웹용 홈 아이콘 */}
                                    <HomeIcon className="w-6 h-6 text-gray-500 hover:text-primary-light transition-colors hidden md:block" />
                                </button>
                                
                                <StudyStatusBadge status={statusName} />
                                <h2 className="text-base font-medium text-surface truncate max-w-[150px] md:max-w-none">
                                    {title}
                                </h2>
                            </div>
                            <div className="relative">
                                <button 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsMenuOpen(!isMenuOpen);
                                    }}
                                    className="ml-4 flex items-center justify-center"
                                >
                                    <PeopleIcon className="w-6 h-6 text-gray-500 hover:text-primary-light transition-colors md:hidden" onClick={onToggleSidebar} />
                                    <DotsIcon className="w-6 h-6 text-surface hidden md:block" />
                                </button>
                                {isMenuOpen && (
                                    <div className="hidden md:block">
                                        <div 
                                            onClick={() => setIsMenuOpen(false)} 
                                        />
                                        
                                        <div className="absolute right-0 mt-1 w-[200px] bg-background border border-gray-300 rounded-[10px] shadow-lg px-2 py-[9px] z-50 hidden md:block animate-in fade-in zoom-in duration-200">
                                            <button 
                                                className="w-[184px] text-left px-[10px] py-[5px] text-base font-regular rounded-[8px] text-surface hover:bg-gray-100"
                                                onClick={() => { /* 알림 설정 로직 */ setIsMenuOpen(false); }}
                                            >
                                                채팅방 알림 끄기
                                            </button>
                                            <button 
                                                className="w-[184px] text-left px-[10px] py-[5px] text-base font-regular rounded-[8px] text-error mt-1 hover:bg-gray-100"
                                                onClick={handleLeaveStudy}
                                            >
                                                스터디 나가기
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                            ) : (
                                /* 데이터 없을 때 빈 상태 유지 */
                                <div className="w-full h-full" /> 
                            )}
                </div>
                <div className="hidden md:block w-[calc((100vw-1190px)/2)] min-w-[200px] shrink-0" />
            </div>
        </div>
    );
}