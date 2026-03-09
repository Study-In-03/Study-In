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

    
    </>
  );
}
