import React from "react";
import { useNavigate } from "react-router-dom";
import type { Study } from "../../../types/study";
import iconRecruiting from "@/assets/base/icon-모집중.svg"; 
import defaultThumbnail from "@/assets/base/User-Profile-L.svg";

interface StudyCardProps {
  study: Study;
}

const StudyCard = ({ study }: StudyCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      // 클릭 시 상세 주소(/study/아이디)로 이동
      onClick={() => navigate(`/study/${study.id}`)}
     className="flex flex-col bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
      
      {/* 1. 카드 상단: 모집 상태 및 지역 배지 (가장 위쪽 영역) */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          {/* 전용 모집중 아이콘 적용 */}
          <img src={iconRecruiting} alt="" className="w-24 h-8" />        
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xm rounded-full">
          노형동
        </span>
      </div>

      {/* 2. 스터디 썸네일 영역: 회색 배경 위 캐릭터 이미지 */}
      <div className="relative aspect-[1/1] bg-[#F4F6F8] flex items-center justify-center overflow-hidden">
        <img 
          src={defaultThumbnail} 
          className="w-50 h-50 object-contain opacity-40 group-hover:scale-110 transition-transform" 
          alt="스터디 썸네일" 
        />
        
        {/* 하트 버튼: 이미지 우측 하단에 고정 */}
        <button aria-label="관심 스터디 추가" className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors">
          <svg className="w-6 h-6 text-gray-300 fill-none stroke-current stroke-2 hover:text-error" viewBox="0 0 24 24">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
      </div>

      {/* 3. 하단 텍스트 정보 영역 */}
      <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
        <div className="flex gap-2 mb-3">
          <span className="px-3 py-1 border border-gray-200 text-gray-500 text-xs rounded-full">프로젝트</span>
          <span className="px-3 py-1 border border-gray-200 text-gray-500 text-xs rounded-full">초급</span>
        </div>

        <h3 className="text-[17px] font-bold text-gray-900 mb-4 line-clamp-2 leading-[1.4] h-12">
          {study.title}
        </h3>

        <div className="mt-auto flex items-center text-sm text-gray-500">
          {/* 사용자 아이콘 혹은 피그마 시안의 인원 아이콘 */}
          <svg className="w-4 h-4 mr-1.5 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span>현재 <b className="text-primary font-bold">{study.current_participants}명</b>이 신청했어요.</span>
        </div>
      </div>
    </div>
  );                 
};

export default StudyCard;
