import React, { Dispatch, SetStateAction } from "react"; 
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
  // 에러 해결을 위해 아래 두 줄을 추가합니다.
  searchTerm: string; 
  onSearchChange: Dispatch<SetStateAction<string>>;
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

const StudyFilter = ({ 
  selectedCategory, 
  onCategoryChange,
  searchTerm,
  onSearchChange 
}: StudyFilterProps) => {
  return (
    <div className="mb-10">
      {/* 카테고리 아이콘 영역 (기존 디자인 유지) */}
      <div className="grid grid-cols-4 md:flex md:flex-row justify-center items-center gap-x-2 gap-y-6 md:gap-x-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className="flex flex-col items-center group transition-all shrink-0 w-[70px] h-[98px]"
          >
            <div className={`w-[60px] h-[60px] rounded-[20px] flex items-center justify-center transition-all duration-200 mb-2 shadow-sm border
              ${selectedCategory === cat.id 
                ? "bg-activation border-primary-light ring-2 ring-primary-light/20 scale-105" 
                : "bg-background border-gray-100 group-hover:bg-gray-50 group-hover:scale-105"}`}
            >
              <img 
                src={cat.icon} 
                alt={cat.label} 
                className="w-full h-full object-contain p-2" 
              />
            </div>
            
            <span className={`text-base font-medium text-center break-keep leading-tight ${
              selectedCategory === cat.id ? "text-primary-light" : "text-gray-700"
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