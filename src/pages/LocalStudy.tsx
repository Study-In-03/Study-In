import { useState } from "react";
import StudyListSection from "../features/study/components/StudyList";

export default function LocalStudy() {
  // 테스트를 위해 상태값을 바꿔보며 확인하실 수 있습니다.
  const [isRegistered, setIsRegistered] = useState(true); // 지역 인증 여부
  const [hasStudies, setHasStudies] = useState(true);    // 스터디 존재 여부
  const [activeTab, setActiveTab] = useState("최신 스터디");

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">내 지역 스터디</h1>
        
        {/* 지역 선택 드롭다운 (디자인 참고) */}
        {isRegistered && (
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg border text-sm text-gray-600 cursor-pointer">
            <span>📍 노형동</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" /></svg>
          </div>
        )}
      </div>

      {/* 상황별 조건부 렌더링 */}
      {!isRegistered ? (
        /* Case 1: 지역 인증이 되지 않은 경우 */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-gray-500 mb-6">내 지역 스터디를 확인하려면 인증이 필요해요.</p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            내 지역 인증하기
          </button>
        </div>
      ) : !hasStudies ? (
        /* Case 2: 스터디가 없는 경우 */
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-gray-500 mb-6">아직 열린 스터디가 없어요.<br/>첫 스터디를 직접 만들어 보세요!</p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            스터디 만들기
          </button>
        </div>
      ) : (
        /* Case 3: 스터디 목록이 있는 경우 */
        <div className="space-y-6">
          <div className="flex gap-3">
            {["최신 스터디", "모집 중 스터디", "진행 중 스터디"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-full text-[14px] font-semibold transition-all ${
                  activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <StudyListSection activeTab={activeTab} selectedCategory="전체" searchTerm="" />
        </div>
      )}
    </div>
  );
}