import React, { useState, useEffect } from "react";
import banner1 from "../../../assets/main-banner-1.png";
import banner2 from "../../../assets/main-banner-2.png";
import banner3 from "../../../assets/main-banner-3.png";  
 
const banners = [
  banner1,
  banner2,
  banner3,
];

export default function StudyBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  // 3초마다 자동 슬라이드
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    /* md:h-[300px]를 md:h-[auto]와 aspect 비율로 변경하여 이미지가 잘리지 않게 합니다 */
    <div className="group relative w-full overflow-hidden rounded-[12px] shadow-sm bg-[#f8f9fa] aspect-[16/9] md:aspect-[3/1]">
      {/* 슬라이드 컨테이너 */}
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        /* eslint-disable-next-line */
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((img, index) => (
          <div
            key={index}
            className="min-w-full h-full flex items-center justify-center bg-[#f8f9fa]"
          >
            <img
              src={img}
              alt={`배너 ${index + 1}`}
              /* object-contain: 이미지가 잘리지 않고 영역 안에 다 들어오게 함
                 w-full h-full: 영역을 꽉 채움 
              */
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* 좌측 화살표 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="이전 슬라이드"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="10 2 3 8.5 10 15"></polyline>
        </svg>
      </button>

      {/* 우측 화살표 */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="다음 슬라이드"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2 2 9 8.5 2 15"></polyline>
        </svg>
      </button>

      {/* 하단 페이지 표시 점 (인디케이터) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${
                currentSlide === index
                  ? "bg-white opacity-100 scale-110" // 활성화된 점: 밝은 흰색, 약간 크게
                  : "bg-white/40 hover:bg-white/60" // 비활성 점: 반투명한 흰색
              }
            `}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
