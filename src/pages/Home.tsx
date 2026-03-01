import React, { useState } from "react"; 
import StudyBanner from "@/features/study/components/StudyBanner";
import StudyFilter from "@/features/study/components/StudyFilter";
import StudyList from "@/features/study/components/StudyList";

export default function Home() {
  // 선택된 카테고리 상태 관리 (기본값 'all')
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState(""); 
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 pb-20">
      <StudyBanner />

      {/* 필터 영역: 상태값과 변경 함수 전달 */}
      <StudyFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchTerm={searchTerm}       
      onSearchChange={setSearchTerm} 
      />

      <section className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            최신 스터디 둘러보기
          </h3>
          <div className="flex gap-4 text-sm">
            <button className="font-bold text-primary border-b-2 border-primary pb-1">
              최신순
            </button>
            <button className="font-medium text-gray-500 pb-1 hover:text-primary-light transition-colors">
              인기순
            </button>
          </div>
        </div>

        {/* 리스트 영역: 선택된 카테고리 정보 전달 */}
        <StudyList selectedCategory={selectedCategory} searchTerm={searchTerm} />
      </section>
    </div>
  );
}
