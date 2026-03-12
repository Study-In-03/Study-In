import React, { useState, useEffect } from "react";
import banner1 from "../../../assets/main-banner-1.png";
import banner2 from "../../../assets/main-banner-2.png";
import banner3 from "../../../assets/main-banner-3.png";
import bannerBg from "@/assets/base/banner.svg";
import character1 from "@/assets/Character-1.png";
import character2 from "@/assets/Character-2.png";
import character3 from "@/assets/Character-3.png";
import LeftIcon from "@/assets/base/icon-left.svg?react";
import RightIcon from "@/assets/base/icon-right.svg?react";

const banners = [banner1, banner2, banner3];

const mobileSlides = [
  {
    character: character1,
    tag: "서비스 소개",
    text: "위니브월드에서\n같이 코딩할\n스터디원을 구해보세요!",
  },
  {
    character: character2,
    tag: "스터디 탐색",
    text: "나에게 맞는\n스터디를 지금\n바로 찾아보세요!",
  },
  {
    character: character3,
    tag: "스터디 참여",
    text: "새로운 스터디에\n참여하고\n함께 성장해봐요!",
  },
];

export default function StudyBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
    {/* ── 모바일 배너 ── */}
    <div className="md:hidden relative w-full overflow-hidden rounded-[12px] aspect-[358/200]">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {mobileSlides.map((slide, index) => (
          <div key={index} className="min-w-full h-full relative overflow-hidden">
            {/* 배경 */}
            <img src={bannerBg} alt="" className="absolute inset-0 w-full h-full object-cover" />

            {/* 태그 pill - top:26px, left:26px */}
            <div className="absolute top-[26px] left-[26px] flex flex-row items-start w-[69px] h-[20px] pt-[4px] px-[10px] pb-[2px] bg-background rounded-[26px]">
              <span className="flex items-center text-center text-xs font-bold leading-[14px] text-surface">{slide.tag}</span>
            </div>

            {/* 메인 텍스트 - top:56px, left:26px, width:162px */}
            <p
              className="absolute top-[56px] left-[26px] w-[162px] text-lg font-bold text-background leading-6 whitespace-pre-line"
              style={{ textShadow: "0px 2px 6px rgba(0, 0, 0, 0.25)" }}
            >
              {slide.text}
            </p>

            {/* 캐릭터 - top:30px, left:198px, 140×140px */}
            <img
              src={slide.character}
              alt={`캐릭터 ${index + 1}`}
              className="absolute top-[30px] left-[198px] w-[140px] h-[140px] object-contain"
            />
          </div>
        ))}
      </div>

      {/* 인디케이터 - 6×8px pill, bottom:20px */}
      <div className="absolute bottom-[20px] left-1/2 -translate-x-1/2 flex gap-[6px] z-10">
        {mobileSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-[6px] h-[8px] rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-background" : "bg-gray-300"
            }`}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          />
        ))}
      </div>
    </div>

    {/* ── 데스크탑 배너 ── */}
    <div className="hidden md:block group relative w-full overflow-hidden rounded-[12px] shadow-sm bg-gray-100 md:aspect-[880/300]">
      <div
        className="flex h-full transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banners.map((img, index) => (
          <div
            key={index}
            className="min-w-full h-full flex items-center justify-center bg-gray-100"
          >
            <img
              src={img}
              alt={`배너 ${index + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* 좌측 화살표 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100"
        aria-label="이전 슬라이드"
      >
        <LeftIcon className="w-[30px] h-[30px] text-background hover:text-gray-500" />
      </button>

      {/* 우측 화살표 */}
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 transition-all opacity-0 group-hover:opacity-100"
        aria-label="다음 슬라이드"
      >
        <RightIcon className="w-[30px] h-[30px] text-background hover:text-gray-500" />
      </button>

      {/* 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "bg-background opacity-100 scale-110"
                : "bg-gray-100 hover:bg-gray-300"
            }`}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          />
        ))}
      </div>
    </div>
    </>
  );
}
