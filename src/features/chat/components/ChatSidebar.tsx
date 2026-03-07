import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrownIcon from '@/assets/base/icon-crown-fill.svg?react';
import DotsIcon from '@/assets/base/icon-dots.svg?react';
import HomeIcon from '@/assets/base/icon-Home.svg?react';
import PersonIcon from '@/assets/base/icon-person.svg?react';
import { axiosInstance } from '@/api/axios';
import { getFullUrl } from '@/api/upload';

interface MemberProfile {
    pk: number;
    nickname: string;
    profile_img: string | null;
}

interface StudyDetail {
    leader: MemberProfile;
    participants: MemberProfile[];
}

interface ChatSidebarProps {
    onClose?: () => void;
}

export default function ChatSidebar({ onClose }: ChatSidebarProps) {
    const navigate = useNavigate();
    const { study_pk } = useParams(); // URL에서 study_pk 가져오기
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [studyData, setStudyData] = useState<StudyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // [API 연동] 스터디 상세 정보를 가져와 멤버 목록 추출
    useEffect(() => {
        const fetchStudyMembers = async () => {
            if (!study_pk) return;
            try {
                setIsLoading(true);
                const response = await axiosInstance.get<StudyDetail>(`/study/${study_pk}/`);
                setStudyData(response.data);
            } catch (error) {
                console.error("멤버 목록을 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudyMembers();
    }, [study_pk]);

    // 전체 인원수 계산 (방장 1명 + 참여자 수)
    const totalMembers = studyData ? studyData.participants.length + 1 : 0;

    if (isLoading) return <div className="p-4 text-gray-500 text-sm">로딩 중...</div>;
    if (!studyData) return <div className="p-4 text-gray-500 text-sm font-regular">데이터가 없습니다.</div>;

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="h-[50px] px-4 flex items-center justify-between border-b border-gray-300 shrink-0 bg-background">
                <h2 className="text-base font-medium text-surface">
                    스터디원 - <span className="text-primary font-bold">{totalMembers}명</span>
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
                    <div className="w-10 h-10 rounded-[42px] bg-gray-300 overflow-hidden shrink-0">
                        {studyData.leader.profile_img ? (
                            <img 
                                src={getFullUrl(studyData.leader.profile_img)} 
                                className="w-full h-full object-cover" 
                                alt="방장" 
                            />
                        ) : (
                            <PersonIcon className="w-6 h-6 text-gray-500 opacity-50" />
                        )}
                    </div>
                    <span className="text-base font-medium text-surface truncate flex-1">
                        {studyData.leader.nickname}
                    </span>
                    <CrownIcon className="w-5 h-5" />
                </div>

                {/* 일반 멤버 */}
                {studyData.participants.map((member) => (
                    <div key={member.pk} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[42px] bg-gray-300">
                            {member.profile_img ? (
                                <img 
                                    src={getFullUrl(member.profile_img)} 
                                    className="w-full h-full object-cover" 
                                    alt="멤버" 
                                />
                            ) : (
                                <PersonIcon className="w-6 h-6 text-gray-500 opacity-50" />
                            )}
                        </div>
                        <span className="text-base font-regular text-surface truncate flex-1">
                            {member.nickname}
                        </span>
                    </div>
                ))}
            </div>

            <div className="md:hidden absolute bottom-0 left-0 right-0 h-[50px] border-t border-gray-300 p-[13px] flex items-center justify-end">
                <button 
                    onClick={() => {
                        if (onClose) onClose();
                        navigate('/');
                    }}
                    className="flex text-gray-500 hover:text-primary-light transition-colors"
                >
                    <HomeIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}