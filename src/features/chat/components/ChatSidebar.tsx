import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CrownIcon from '@/assets/base/icon-crown-fill.svg?react';
import DotsIcon from '@/assets/base/icon-dots.svg?react';
import HomeIcon from '@/assets/base/icon-Home.svg?react';
import EmptyProfileIcon from '@/assets/base/icon-empty-profile.svg?react';
import { getStudy, leaveStudy } from '@/api/study';
import { getFullUrl } from '@/api/upload';

interface MemberProfile {
    id: number;
    profile: {
        nickname: string;
        profile_img: string;
    };
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
    const { study_pk } = useParams();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [studyData, setStudyData] = useState<StudyDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // getStudy() 함수로 통일 (axiosInstance 직접 호출 제거)
    useEffect(() => {
        const fetchStudyMembers = async () => {
            if (!study_pk) return;
            try {
                setIsLoading(true);
                const data = await getStudy(Number(study_pk));
                setStudyData({
                    leader: data.leader,
                    participants: data.participants,
                });
            } catch (error) {
                console.error("멤버 목록을 불러오는데 실패했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudyMembers();
    }, [study_pk]);

    // 스터디 나가기 - DELETE /study/{study_pk}/participate/
    const handleLeaveStudy = async () => {
        if (!window.confirm("정말 이 스터디를 나가시겠습니까?")) return;
        try {
            await leaveStudy(Number(study_pk));
            alert("스터디 탈퇴가 완료되었습니다.");
            if (onClose) onClose();
            navigate('/');
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || "스터디 탈퇴에 실패했습니다.";
            alert(errorMsg);
        } finally {
            setIsMenuOpen(false);
        }
    };

    const totalMembers = studyData ? studyData.participants.length + 1 : 0;

    // 수정 후
if (isLoading) return (
    <div className="flex-1 flex items-center justify-center text-gray-500 text-base font-regular">
        로딩 중...
    </div>
);
if (!studyData) return (
    <div className="flex-1 flex items-center justify-center text-gray-500 text-base font-regular">
        데이터가 없습니다.
    </div>
);

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="h-[50px] px-4 flex items-center justify-between border-b border-gray-300 shrink-0 bg-background">
                <h2 className="text-base font-medium text-surface">
                    스터디원 - <span className="text-primary font-bold">{totalMembers}명</span>
                </h2>
                <div className="relative">
                    <button
                        className="text-gray-500 hover:text-primary-light transition-colors"
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
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    채팅방 알림 끄기
                                </button>
                                {/* 나가기 API 연동 */}
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

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {/* 스터디장 */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[42px] bg-gray-300 overflow-hidden shrink-0">
                        {studyData.leader.profile.profile_img ? (
                            <img
                                src={getFullUrl(studyData.leader.profile.profile_img)}
                                className="w-full h-full object-cover"
                                alt="방장"
                            />
                        ) : (
                            <EmptyProfileIcon className="w-full h-ful" />
                        )}
                    </div>
                    <span className="text-base font-medium text-surface truncate flex-1">
                        {studyData.leader.profile.nickname}
                    </span>
                    <CrownIcon className="w-5 h-5" />
                </div>

                {/* 일반 멤버 */}
                {studyData.participants.map((member) => (
                    <div key={member.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[42px] bg-gray-300 overflow-hidden">
                            {member.profile.profile_img ? (
                                <img
                                    src={getFullUrl(member.profile.profile_img)}
                                    className="w-full h-full object-cover"
                                    alt="멤버"
                                />
                            ) : (
                                <EmptyProfileIcon className="w-full h-ful" />
                            )}
                        </div>
                        <span className="text-base font-regular text-surface truncate flex-1">
                            {member.profile.nickname}
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
