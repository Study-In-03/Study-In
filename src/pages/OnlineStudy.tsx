import { useState } from "react";
import StudyListSection from "../features/study/components/StudyList";

export default function OnlineStudy() {
  const [activeTab, setActiveTab] = useState("최신 스터디");
  // 페이지네이션을 위한 상태 (나중에 API 연결 시 사용)
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 min-h-[800px]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">온라인 스터디</h1>
        <p className="text-gray-500 text-sm">장소 제약 없이 어디서든 함께 열공하세요.</p>
      </div>

      <div className="space-y-6">
        {/* 탭 메뉴 */}
        <div className="flex gap-3">
          {["최신 스터디", "모집 중 스터디", "진행 중 스터디"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 rounded-full text-lg font-bold transition-all ${
                activeTab === tab 
                  ? "bg-primary text-white shadow-sm" 
                  : "bg-gray-100 text-gray-500 hover:bg-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 스터디 리스트 영역 */}
        <StudyListSection 
          activeTab={activeTab} 
          selectedCategory="전체" 
          searchTerm="" 
        />

        {/* 페이지네이션 (디자인 반영) */}
        <div className="flex justify-center items-center gap-2 py-10">
          <button aria-label="이전 페이지" className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-all ${
                currentPage === num 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-400 hover:bg-gray-100"
              }`}
            >
              {num}
            </button>
          ))}
          <button aria-label="다음 페이지" className="p-2 text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}