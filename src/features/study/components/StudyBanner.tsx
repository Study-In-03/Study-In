import React, { useState, useEffect } from "react";
import banner1 from "../../../assets/main-banner-1.png";
import banner2 from "../../../assets/main-banner-2.png";
import banner3 from "../../../assets/main-banner-3.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StudyBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const banners = [banner1, banner2, banner3];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    /* 피그마 기준: 너비 880px, 중앙 정렬 */
    <div className="group relative w-full max-w-[880px] mx-auto mb-10" style={{ opacity: 1 }}>
      
      {/* 피그마 기준: 높이 300px, 곡률 12px */}
      <div className="relative h-[300px] overflow-hidden rounded-[12px] shadow-sm bg-gray-100">
        
        {/* 이미지 슬라이드 영역 */}
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%) rotate(0deg)` }}
        >
          {banners.map((img, index) => (
            <div key={index} className="min-w-full h-full">
              <img src={img} alt={`배너 ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* 좌측 화살표 버튼 */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition-opacity group-hover:opacity-100 opacity-0"
          aria-label="이전 슬라이드"
        >
          <ChevronLeft size={32} />
        </button>

        {/* 우측 화살표 버튼 */}
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full text-white transition-opacity group-hover:opacity-100 opacity-0"
          aria-label="다음 슬라이드"
        >
          <ChevronRight size={32} />
        </button>

        {/* 하단 페이지네이션 점 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-primary w-6' : 'bg-gray-300 w-2'
              }`}
              aria-label={`${index + 1}번 슬라이드로 이동`}
            />
          ))}
        </div>

      </div> {/* 이 닫는 태그가 높이 300px 상자를 닫습니다. */}
    </div> /* 이 닫는 태그가 전체 880px 상자를 닫습니다. */
  );
}