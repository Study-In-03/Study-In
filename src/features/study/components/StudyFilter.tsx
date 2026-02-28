import React from 'react';

// 1. Home에서 보내주는 데이터들의 타입을 정의합니다.
interface StudyFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchTerm: string;         // 👈 이거 추가!
  onSearchChange: (value: string) => void; // 👈 이것도 추가!
}

const CATEGORIES = [
  { id: "all", label: "전체", icon: "🌐" }, // 👈 '전체' 카테고리 추가
  { id: "lecture", label: "특강", icon: "🎓" },
  { id: "concept", label: "개념학습", icon: "📖" },
  { id: "apply", label: "응용/활용", icon: "💻" },
  { id: "project", label: "프로젝트", icon: "🚀" },
  { id: "challenge", label: "챌린지", icon: "🔥" },
  { id: "cert", label: "자격증/시험", icon: "📝" },
  { id: "job", label: "취업/코테", icon: "💼" },
  { id: "etc", label: "기타", icon: "✨" },
];

const StudyFilter = ({ selectedCategory, onCategoryChange, searchTerm, onSearchChange }: StudyFilterProps) => {
  return (
  <div className="space-y-8 mb-10">
    {/* 1. 검색창 영역 (절대 사라지면 안 되죠!) */}
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="어떤 스터디를 찾고 계신가요?"
        className="w-full py-4 px-6 rounded-2xl bg-gray-100 border-none focus:ring-2 focus:ring-primary-light outline-none text-base font-medium placeholder:text-gray-500"
      />
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-700">
        🔍
      </button>
    </div>

    {/* 2. 카테고리 영역: 전체(왼쪽) + 나머지 8개(오른쪽 그리드) */}
    <div className="flex justify-center items-start gap-6 md:gap-10">
      
      {/* 왼쪽: '전체' 버튼 (혼자서 왼쪽 공간 차지) */}
      <div className="flex flex-col items-center pt-1">
        <button
          onClick={() => onCategoryChange('all')}
          className={`group flex flex-col items-center gap-2 transition-all ${
            selectedCategory === 'all' ? "scale-105" : ""
          }`}
        >
          <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[20px] flex items-center justify-center shadow-sm border transition-all duration-200 
            ${selectedCategory === 'all' 
              ? "bg-activation border-primary-light ring-2 ring-primary-light/20" 
              : "bg-background border-gray-100 group-hover:bg-activation"}`}
          >
            <span className="text-2xl">🌐</span>
          </div>
          <span className={`text-sm font-bold ${selectedCategory === 'all' ? "text-primary" : "text-gray-700"}`}>
            전체
          </span>
        </button>
      </div>

      {/* 오른쪽: 나머지 8개 버튼 (4열 2단 그리드) */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-6">
        {CATEGORIES.filter(cat => cat.id !== 'all').map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`group flex flex-col items-center gap-2 w-16 md:w-20 transition-all ${
              selectedCategory === cat.id ? "scale-105" : ""
            }`}
          >
            <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[20px] flex items-center justify-center shadow-sm border transition-all duration-200 
              ${selectedCategory === cat.id
                ? "bg-activation border-primary-light ring-2 ring-primary-light/20"
                : "bg-background border-gray-100 group-hover:bg-activation"
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
            </div>
            <span className={`text-sm font-medium transition-colors ${
              selectedCategory === cat.id ? "text-primary" : "text-gray-700 group-hover:text-primary"
            }`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  </div>
);
};

export default StudyFilter;
