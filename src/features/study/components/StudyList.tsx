import React from 'react';
import { useStudyList } from '../hooks/useStudyList'; // 커스텀 훅 가져오기
import StudyCard from './StudyCard';

// 1. Props 타입 정의에 activeTab을 추가합니다.
interface StudyListProps {
  selectedCategory: string;
  searchTerm: string;
  activeTab: string; // 추가된 부분
}

export default function StudyList({ 
  selectedCategory, 
  searchTerm, 
  activeTab // 2. 여기서 부모(Home.tsx)가 보내준 탭 정보를 받습니다.
}: StudyListProps) {

  // 3. 커스텀 훅에 activeTab을 전달합니다. (훅 내부에서 탭에 맞는 필터링을 수행하게 됩니다)
  const { studies, isLoading, error } = useStudyList(selectedCategory, searchTerm, activeTab); 

  // 로딩 중이거나 에러가 났을 때의 화면 처리
  if (isLoading) return <div className="p-10 text-center text-gray-500 font-medium">스터디를 불러오는 중입니다...</div>;
  if (error) return <div className="p-10 text-center text-error font-medium">{error}</div>;

  // 데이터가 없을 때의 예외 처리
  if (studies.length === 0) return <div className="p-10 text-center text-gray-500">해당 카테고리에 등록된 스터디가 없습니다.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
      {studies.map((study) => (
        <StudyCard key={study.id} study={study} />
      ))}
    </div>
  );
}