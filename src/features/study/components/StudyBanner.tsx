import React from 'react';
import { Link } from 'react-router-dom';

const StudyBanner = () => {
  return (
    /* 배너 */
    <Link to="/promotion" className="block mb-8">
      <section className="relative overflow-hidden rounded-[30px] bg-surface text-background p-6 md:p-10 min-h-45 md:min-h-65 flex items-center transition-transform hover:scale-[1.01]">
        <div className="relative z-10 space-y-2 md:space-y-4">
          <span className="inline-block bg-primary px-3 py-1 rounded-full text-xs font-bold">
            서비스 소개
          </span>
          <h2 className="text-lg md-[30px] font-bold leading-tight">
            위니브 월드에서<br />
            같이 코딩할 스터디원을<br />
            구해보세요!
          </h2>
        </div>

        {/* 배너 캐릭터 이미지 배치 (피그마 시안 반영) */}
        <div className="absolute right-4 bottom-0 w-32 md:w-56 pointer-events-none">
          <img 
            src="/assets/banner-character.png" 
            alt="Studyin Character" 
            className="w-full h-full object-contain"
          />
        </div>
      </section>
    </Link>
  );
};

export default StudyBanner;