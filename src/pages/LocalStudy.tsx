import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import StudyListSection from "../features/study/components/StudyList";
import { getProfile } from "@/api/profile";
import { storage } from "@/utils/storage";
import { useAuthStore } from "@/store/authStore";
import type { PreferredRegion } from "@/types/user";
import { STUDY_TABS, DEFAULT_STUDY_TAB } from "@/constants/study";
import iconLocation from "../assets/base/icon-location.svg";
import iconTriangleDown from "@/assets/base/icon-Triangle-Down.svg";
import iconTriangleUp from "@/assets/base/icon-Triangle-Up.svg";

export default function LocalStudy() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const [activeTab, setActiveTab] = useState(DEFAULT_STUDY_TAB);
  const [region, setRegion] = useState<PreferredRegion | null | undefined>(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) { setRegion(null); return; }
    const userId = storage.getUserId();
    if (!userId) { setRegion(null); return; }

    getProfile(userId)
      .then((profile) => setRegion(profile.preferred_region))
      .catch(() => setRegion(null));
  }, [isLoggedIn]);

  if (region === undefined) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1190px] mx-auto px-4 py-10 min-h-[600px]">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-[30px] font-bold text-surface">내 지역 스터디</h1>

        {/* 드롭다운 버튼 (지역 인증 시에만 표시) */}
        {region && (
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className={`w-[160px] md:w-[200px] h-[40px] flex items-center bg-background rounded-[8px] transition-colors ${
                dropdownOpen
                  ? "border-2 border-primary"
                  : "border border-gray-300"
              }`}
            >
              <img src={iconLocation} alt="" className="w-5 h-5 ml-[14px] shrink-0 text-primary" />
              <span className="flex-1 text-left ml-[6px] text-lg font-medium text-primary truncate">
                {region.location}
              </span>
              <img
                src={dropdownOpen ? iconTriangleUp : iconTriangleDown}
                alt=""
                className="w-[18px] h-[18px] mr-[10px] shrink-0"
              />
            </button>

            {/* 드롭다운 메뉴 */}
            {dropdownOpen && (
              <div className="absolute right-0 top-[44px] w-[200px] bg-background border border-gray-300 rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] z-10 py-1">
                <div className="h-[40px] px-2 flex items-center">
                  <span className="w-full h-[30px] flex items-center px-[10px] text-base font-medium text-surface rounded-[8px] bg-gray-100">
                    {region.location}
                  </span>
                </div>
                <div className="h-[40px] px-2 flex items-center">
                  <button
                    onClick={() => { setDropdownOpen(false); navigate("/profile/edit"); }}
                    className="w-full h-[30px] flex items-center px-[10px] text-base text-surface rounded-[8px] hover:bg-gray-100 transition-colors"
                  >
                    내지역 재인증
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 탭 버튼 (항상 표시) */}
      <div className="flex gap-[10px] md:gap-[14px] mb-6">
        {STUDY_TABS.map((tab) => (
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

      {/* 지역 미인증 안내 */}
      {!region ? (
        <div className="flex flex-col items-center gap-5 py-24">
          <p className="text-xl font-bold text-gray-700 text-center">
            내 지역 스터디를 확인하려면 인증이 필요해요.
          </p>
          <button
            onClick={() => navigate("/profile/edit")}
            className="w-[250px] h-[50px] bg-primary text-background rounded-[8px] font-medium text-lg"
          >
            내 지역 인증하기
          </button>
        </div>
      ) : (
        <StudyListSection
          activeTab={activeTab}
          selectedCategory="전체"
          searchTerm=""
          locationId={region.id}
          large
        />
      )}
    </div>
  );
}
