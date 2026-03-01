import { useState, useRef, useEffect } from "react";
import iconDots from "@/assets/base/icon-dots.svg";

interface StudyCreateTopBarProps {
  isValid: boolean;
  isSubmitting?: boolean;
  onViewStudy?: () => void;
  onDeleteStudy?: () => void;
}

export default function StudyCreateTopBar({ isValid, isSubmitting = false, onViewStudy, onDeleteStudy }: StudyCreateTopBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteHovered, setIsDeleteHovered] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="w-full bg-background border-b border-gray-300">
      <div className="max-w-[1200px] mx-auto h-[56px] lg:h-[60px] px-4 flex items-center justify-end gap-[8px]">
        {onViewStudy && (
          <button
            type="button"
            onClick={onViewStudy}
            className="w-[110px] lg:w-40 h-10 border border-gray-300 rounded-lg text-sm font-medium text-surface bg-background transition-colors hover:bg-gray-100"
          >
            스터디 보기
          </button>
        )}
        <button
          type="submit"
          form="study-create-form"
          disabled={!isValid || isSubmitting}
          className={`w-40 h-10 rounded-lg text-sm font-medium text-background transition-colors ${
            isValid && !isSubmitting ? "bg-primary" : "bg-gray-300"
          }`}
        >
          {isSubmitting ? "생성 중..." : "스터디 만들기"}
        </button>
        {onViewStudy && (
          <div ref={dropdownRef} className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-[30px] h-[30px] flex items-center justify-center"
            >
              <img src={iconDots} alt="더보기" className="w-[30px] h-[30px]" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 top-[38px] w-[160px] bg-background border border-gray-300 rounded-[10px] shadow-[0px_5px_15px_rgba(71,73,77,0.1)] z-20 py-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onDeleteStudy?.();
                  }}
                  className="w-full h-10 flex items-center px-2"
                  onMouseEnter={() => setIsDeleteHovered(true)}
                  onMouseLeave={() => setIsDeleteHovered(false)}
                >
                  <span
                    className={`w-full h-[30px] flex items-center px-[10px] rounded-lg text-sm text-surface transition-colors ${
                      isDeleteHovered ? "bg-gray-100" : "bg-transparent"
                    }`}
                  >
                    스터디 삭제
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
