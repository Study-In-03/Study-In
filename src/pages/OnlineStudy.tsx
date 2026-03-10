import { useState } from "react";
import StudyListSection from "../features/study/components/StudyList";

export default function OnlineStudy() {
  const [activeTab, setActiveTab] = useState("최신 스터디");

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 min-h-[800px]">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface mb-2">온라인 스터디</h1>
      </div>

      <div className="space-y-6">
        {/* 탭 메뉴 */}
        <div className="flex gap-[10px] md:gap-[14px]">
          {["최신 스터디", "모집 중 스터디", "진행 중 스터디"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-[32px] md:h-[44px] px-[14px] md:px-[16px] rounded-full text-base md:text-lg transition-all ${
                activeTab === tab
                  ? "bg-primary text-background font-bold"
                  : "bg-gray-100 text-gray-700 font-normal hover:bg-gray-200"
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
          large
        />

      </div>
    </div>
  );
}