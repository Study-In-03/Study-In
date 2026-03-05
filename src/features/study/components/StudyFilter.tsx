import React from "react";
// 1. SVG 아이콘 경로 설정 (image_2480e2.png 참조)
import iconSpecial from "@/assets/category/subject_특강.svg";
import iconConcept from "@/assets/category/subject_개념학습-2.svg";
import iconApplied from "@/assets/category/subject_응용활용.svg";
import iconProject from "@/assets/category/subject_프로젝트.svg";
import iconChallenge from "@/assets/category/subject_챌린지.svg";
import iconCert from "@/assets/category/subject_자격증시험.svg";
import iconJob from "@/assets/category/subject_취업코테.svg";
import iconEtc from "@/assets/category/subject_기타.svg";

interface StudyFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  // searchTerm과 onSearchChange는 이제 헤더에서 관리하므로 여기서 사용하지 않아도 됩니다.
}

const CATEGORIES = [
  { id: "lecture", label: "특강", icon: iconSpecial },
  { id: "concept", label: "개념학습", icon: iconConcept },
  { id: "apply", label: "응용/활용", icon: iconApplied },
  { id: "project", label: "프로젝트", icon: iconProject },
  { id: "challenge", label: "챌린지", icon: iconChallenge },
  { id: "cert", label: "자격증/시험", icon: iconCert },
  { id: "job", label: "취업/코테", icon: iconJob },
  { id: "etc", label: "기타", icon: iconEtc },
];

const StudyFilter = ({ selectedCategory, onCategoryChange }: StudyFilterProps) => {
  return (
    <div className="mb-10">
      {/* 중복된 검색창 영역을 삭제했습니다. */}

      {/* 반응형 그리드 설정: 
        - grid-cols-4: 모바일에서 4열 배치 (2행 구성)
        - md:flex: 웹 화면에서는 한 줄로 길게 배치
      */}
      <div className="grid grid-cols-4 md:flex md:flex-row justify-center items-center gap-x-2 gap-y-6 md:gap-x-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            // 외숙님이 요청하신 70x98 사이즈 적용
            className="flex flex-col items-center group transition-all shrink-0"
            style={{ width: '70px', height: '98px' }}
          >
            {/* 아이콘 영역: 60x60 사이즈 고정 */}
            <div className={`w-[60px] h-[60px] rounded-[20px] flex items-center justify-center transition-all duration-200 mb-2 shadow-sm border
              ${selectedCategory === cat.id 
                ? "bg-activation border-primary-light ring-2 ring-primary-light/20 scale-105" 
                : "bg-white border-gray-100 group-hover:bg-gray-50 group-hover:scale-105"}`}
            >
              <img 
                src={cat.icon} 
                alt={cat.label} 
                className="w-full h-full object-contain p-2" 
              />
            </div>
            
            {/* 카테고리 이름 레이블 */}
            <span className={`text-[13px] font-bold text-center break-keep leading-tight ${
              selectedCategory === cat.id ? "text-primary" : "text-gray-700"
            }`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StudyFilter;