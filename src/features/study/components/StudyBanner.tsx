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
    /* 1. 배너가 너무 퍼지지 않게 좌우 여백(px-4)과 최대 너비(max-w-7xl)를 추가했습니다. */
    <div className="group relative w-full max-w-7xl mx-auto px-4 mb-10">
      <div className="relative h-[300px] md:h-[400px] overflow-hidden rounded-2xl shadow-sm">
        {/* 이미지 슬라이드 영역 */}
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((img, index) => (
            <div key={index} className="min-w-full h-full">
              {/* object-contain을 사용하면 그림이 잘리지 않고 전체가 다 보입니다. */}
              <img src={img} alt={`배너 ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        {/* 2. 화살표 수정: 배경 동그라미 제거, 색상 대비 선명하게 변경 */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 text-white hover:text-white transition-colors"
          aria-label="이전 슬라이드"
        >
          <ChevronLeft size={48} strokeWidth={2} /> {/* 크기를 키우고 선을 얇게 조절 */}
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white transition-colors"
          aria-label="다음 슬라이드"
        >
          <ChevronRight size={48} strokeWidth={2} />
        </button>

        {/* 페이지네이션 점 위치 조정 */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-primary w-6' : 'bg-gray-300 w-2'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}