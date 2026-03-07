import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { axiosInstance } from '@/api/axios';
import { getFullUrl } from '@/api/upload';

interface ChatRoomListProps {
    onClose?: () => void;
}

interface ParticipatingStudy {
    pk: number;
    title: string;
    thumbnail: string | null;
}

export default function ChatRoomList({ onClose }: ChatRoomListProps) {
    const navigate = useNavigate();
    const { study_pk } = useParams(); // 현재 접속 중인 방 표시용
    const [studies, setStudies] = useState<ParticipatingStudy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // [API 연동] 참여 중인 스터디 목록 가져오기
    useEffect(() => {
        const fetchStudies = async () => {
            try {
                setIsLoading(true);
                const response = await axiosInstance.get<ParticipatingStudy[]>('/study/my-participating-study/');
                setStudies(response.data);
            } catch (error) {
                console.error("참여 스터디 목록을 불러오지 못했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudies();
    }, []);

    const handleRoomClick = (pk: number) => {
        navigate(`/chat/${pk}`); // 채팅방 이동
        if (onClose) onClose(); // 모바일 환경에서 리스트 닫기
    };

    return (
        <div className="flex flex-col h-full bg-background w-full overflow-hidden">

            {/* 스터디 목록 */}
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">목록 로딩 중...</div>
                        ) : studies.length === 0 ? (
                            <div className="p-10 text-center text-gray-500 text-sm">참여 중인 스터디가 없습니다.</div>
                        ) : (
                        studies.map((study) => (
                            <div 
                                key={study.pk} 
                                className={`p-4 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                                    Number(study_pk) === study.pk ? 'bg-gray-300' : ''
                                }`}
                                onClick={() => handleRoomClick(study.pk)} 
                            >
                            {/* 스터디 이미지 */}
                            <div className="w-[52px] h-[52px] rounded-[16px] bg-gray-300 shrink-0 flex items-center justify-center relative shadow-sm">
                                {study.thumbnail ? (
                                    <img 
                                        src={getFullUrl(study.thumbnail)} 
                                        alt={study.title} 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-xs">No Img</div>
                                )}
                                {/* 실시간 알림 기능이 추가될 경우 조건부 렌더링 가능 */}
                                <span className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-[8px]" />
                            </div>
                            
                            {/* 스터디 채팅방 목록 */}
                            <div className="flex flex-col overflow-hidden">
                                <span className={`text-base truncate font-medium ${
                                    Number(study_pk) === study.pk ? 'text-primary' : 'text-surface'
                                }`}>
                                    {study.title}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}