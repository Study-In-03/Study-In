import { useStudyList } from '../hooks/useStudyList'; // 커스텀 훅 가져오기
import StudyCard from './StudyCard';
import { useNavigate } from 'react-router-dom';

// 1. Props 타입 정의에 activeTab을 추가합니다.
interface StudyListProps {
  selectedCategory: string;
  searchTerm: string;
  activeTab: string; // 추가된 부분
}

export default function StudyList({
  selectedCategory,
  searchTerm,
  activeTab
}: StudyListProps) {
  const navigate = useNavigate();
  const { studies, isLoading, error } = useStudyList(selectedCategory, searchTerm, activeTab);

  if (isLoading) return <div className="p-10 text-center text-gray-500 font-medium">스터디를 불러오는 중입니다...</div>;
  if (error) return <div className="p-10 text-center text-error font-medium">{error}</div>;

  if (studies.length === 0) return (
    <div className="flex flex-col items-center py-16 gap-5">
      <div className="flex flex-col items-center gap-[10px]">
        <p className="text-[18px] font-bold text-surface text-center">아직 열린 스터디가 없어요.</p>
        <p className="text-[16px] text-[#47494D] text-center">첫 스터디를 직접 만들어 보세요!</p>
      </div>
      <button
        onClick={() => navigate("/study/create")}
        className="w-[250px] h-[50px] bg-primary text-white text-[16px] font-medium rounded-[8px]"
      >
        스터디 만들기
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-[10px] md:gap-6 md:px-4">
      {studies.map((study) => (
        <StudyCard key={study.id} study={study} />
      ))}
    </div>
  );
}
