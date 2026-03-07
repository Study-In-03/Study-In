import StudyBanner from "../features/study/components/StudyBanner";
import StudyProfileCard from "../features/study/components/StudyProfileCard";
import StudyListSection from "../features/study/components/StudyList";
import { useState } from "react";
import iconSpecial from "../assets/category/subject_특강.svg";
import iconConcept from "../assets/category/subject_개념학습-2.svg";
import iconApply from "../assets/category/subject_응용활용.svg";
import iconProject from "../assets/category/subject_프로젝트.svg";
import iconChallenge from "../assets/category/subject_챌린지.svg";
import iconExam from "../assets/category/subject_자격증시험.svg";
import iconJob from "../assets/category/subject_취업코테.svg";
import iconEtc from "../assets/category/subject_기타.svg";

const isLoggedIn = true;

const categories = [
  { id: 1, name: "특강", icon: iconSpecial },
  { id: 2, name: "개념학습", icon: iconConcept },
  { id: 3, name: "응용/활용", icon: iconApply },
  { id: 4, name: "프로젝트", icon: iconProject },
  { id: 5, name: "챌린지", icon: iconChallenge },
  { id: 6, name: "자격증/시험", icon: iconExam },
  { id: 7, name: "취업/코테", icon: iconJob },
  { id: 8, name: "기타", icon: iconEtc },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("최신 스터디");
  return ( 
    <>   
    <div className="max-w-[1200px] mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-12">
          <StudyBanner />
          <div className="flex justify-between items-center py-4 overflow-x-auto gap-4 no-scrollbar">
            {categories.map((category) => (
              <button
                key={category.id}
                className="flex flex-col items-center min-w-[75px] gap-3 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center transition-all group-hover:bg-blue-50">
                  <img
                    src={category.icon}
                    alt={category.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="text-[14px] font-semibold text-gray-600 group-hover:text-blue-600">
                  {category.name}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              스터디 둘러보기
            </h2>

            <div className="flex gap-3">
              {["최신 스터디", "모집 중 스터디", "진행 중 스터디"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`
          px-5 py-2 rounded-full text-[14px] font-semibold transition-all
          ${
            activeTab === tab
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }
        `}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <StudyListSection
              activeTab={activeTab}
              selectedCategory="전체"
              searchTerm=""
            />
          </div>
        </div>

        <aside className="w-full md:w-[320px] sticky top-24">
          <StudyProfileCard isLoggedIn={true} />
        </aside>
      </div>
    </div>

    {/* md:px-6 -> PC/태블릿 여백, px-4 -> 모바일 여백*/}
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-10">
      
      {/* flex-col (모바일) <-> flex-row (PC/lg) 전환 */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* 왼쪽 메인 컨텐츠 영역: 모바일은 w-full */}
        <div className="flex-1 w-full space-y-8">
          <StudyBanner />
          
          {/* 모바일 검색창 (시안 반영) */}
          <div className="lg:hidden w-full relative">
            <input type="text" placeholder="어떤 스터디를 찾고 계신가요?" className="w-full px-5 py-3 bg-gray-50 rounded-full border border-gray-100" />
            <button className="absolute right-5 top-1/2 -translate-y-1/2">🔍</button>
          </div>

          {/* 스터디 리스트 영역 */}
          <div className="mt-8">
            <StudyListSection activeTab={activeTab} selectedCategory="전체" searchTerm="" />
          </div>
        </div>

        {/* 오른쪽 사이드바 (프로필, 참여 스터디) */}
        {/* hidden md:block: 모바일은 숨기고 태블릿부터 표시하거나 아래로 이동 */}
        <aside className="w-full lg:w-[300px] mt-10 lg:mt-0 space-y-8>
          <StudyProfileCard isLoggedIn={isLoggedIn} />

          
        flex flex-col items-center lg:items-start">
          {isLoggedIn ? (
            /* 로그인 했을 때 (PC/태블릿 시안 image_1.png) */
            <>
              <StudyProfileCard isLoggedIn={isLoggedIn} />
              {/* 참여 중인 스터디 리스트 컴포넌트 추가 필요 */}
              <div className="w-full h-[300px] bg-gray-50 rounded-xl p-6 border border-gray-100">참여 중인 스터디 (개발 필요)</div>
            </>
          ) : (
            /* 로그인 안 했을 때 모바일 시안 (image_5.png) */
            <div className="w-full h-[200px] bg-gray-50 rounded-xl p-6 border border-gray-100 flex items-center justify-center text-gray-500">
              로그인이 필요합니다.
            </div>
          )}
        </aside>
      </div>
    </div>
    </>
  );
}
