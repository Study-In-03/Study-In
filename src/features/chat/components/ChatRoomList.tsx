import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getParticipatingStudies } from '@/api/study';
import { getFullUrl } from '@/api/upload';

interface ChatRoomListProps {
    onClose?: () => void;
    onCountChange?: (count: number) => void; // ChatHeader의 참여 스터디 개수와 공유
}

interface ParticipatingStudy {
    id: number;
    title: string;
    thumbnail: string | null;
}

export default function ChatRoomList({ onClose, onCountChange }: ChatRoomListProps) {
    const navigate = useNavigate();
    const { study_pk } = useParams();
    const [studies, setStudies] = useState<ParticipatingStudy[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudies = async () => {
            try {
                setIsLoading(true);
                const data = await getParticipatingStudies();
                // getParticipatingStudies는 StudyApiData[]를 반환하므로 필요한 필드만 추출
                const mapped: ParticipatingStudy[] = data.map((s) => ({
                id: s.id,
                title: s.title,
                thumbnail: s.thumbnail,
                }));
                setStudies(mapped);
                onCountChange?.(mapped.length);
            } catch (error) {
                console.error("참여 스터디 목록을 불러오지 못했습니다.", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudies();
    }, []);

    const handleRoomClick = (pk: number) => {
        navigate(`/chat/${pk}`);
        if (onClose) onClose();
    };

    return (
        <div className="flex flex-col h-full bg-background w-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-4 text-center text-gray-500 text-sm">목록 로딩 중...</div>
                ) : studies.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 text-sm">참여 중인 스터디가 없습니다.</div>
                ) : (
                    studies.map((study) => (
                        <div
                            key={`study-room-${study.id}`}
                            className={`p-4 flex items-center gap-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                                Number(study_pk) === study.id ? 'bg-gray-300' : ''
                            }`}
                            onClick={() => handleRoomClick(study.id)}
                        >
                            <div className="w-[52px] h-[52px] rounded-[16px] bg-gray-300 shrink-0 flex items-center justify-center relative shadow-sm overflow-hidden">
                                {study.thumbnail ? (
                                    <img
                                        src={getFullUrl(study.thumbnail)}
                                        alt={study.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-gray-500 text-xs">No Img</div>
                                )}
                                <span className="absolute top-0 left-0 w-2 h-2 bg-primary rounded-[8px]" />
                            </div>

                            <div className="flex flex-col overflow-hidden">
                                <span className={`text-base truncate font-medium ${
                                    Number(study_pk) === study.id ? 'text-primary' : 'text-surface'
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
