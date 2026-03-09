import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Study } from "../../../types/study";
import { likeStudy, unlikeStudy } from "@/api/study";
import { getFullUrl } from "@/api/upload";
import iconRecruiting from "@/assets/base/icon-모집중.svg";
import defaultThumbnail from "@/assets/base/User-Profile-L.svg";
import HeartIcon from "@/assets/base/icon-heart.svg?react";
import HeartFillIcon from "@/assets/base/icon-heart-fill.svg?react";

interface StudyCardProps {
  study: Study;
}

const StudyCard = ({ study }: StudyCardProps) => {
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(study.user_liked ?? false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      if (isLiked) {
        await unlikeStudy(study.id);
        setIsLiked(false);
      } else {
        await likeStudy(study.id);
        setIsLiked(true);
      }
    } catch (error: any) {
      // 409: 이미 좋아요/취소 상태 → 로컬 state 동기화
      if (error.response?.status === 409) {
        setIsLiked((prev) => !prev);
      }
    } finally {
      setIsLikeLoading(false);
    }
  };

  const statusName = study.study_status?.name ?? "";

  const statusColors: Record<string, string> = {
    "모집 중": "bg-primary",
    "모집 완료": "bg-warning",
    "진행 중": "bg-warning",
    "완료": "bg-gray-400",
  };

  const thumbnailSrc = study.thumbnail
    ? getFullUrl(study.thumbnail)
    : defaultThumbnail;

  return (
    <div
      onClick={() => navigate(`/study/${study.id}`)}
      className="flex flex-col bg-white rounded-[24px] border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          {statusName === "모집 중" ? (
            <img src={iconRecruiting} alt="모집 중" className="w-24 h-8" />
          ) : (
            <span className={`px-3 py-1 text-xs text-background rounded-full ${statusColors[statusName] ?? "bg-gray-400"}`}>
              {statusName}
            </span>
          )}
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
          {study.study_location?.location ?? "온라인"}
        </span>
      </div>

      {/* 스터디 썸네일 */}
      <div className="relative aspect-[1/1] bg-[#F4F6F8] flex items-center justify-center overflow-hidden">
        <img
          src={thumbnailSrc}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          alt="스터디 썸네일"
        />

        <button
          aria-label={isLiked ? "관심 스터디 해제" : "관심 스터디 추가"}
          onClick={handleLike}
          disabled={isLikeLoading}
          className="absolute bottom-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
        >
          {isLiked ? (
            <HeartFillIcon className="w-6 h-6 text-error" />
          ) : (
            <HeartIcon className="w-6 h-6 text-gray-300" />
          )}
        </button>
      </div>

      {/* 하단 텍스트 정보 */}
      <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
        <div className="flex gap-2 mb-3">
          {study.subject && (
            <span className="px-3 py-1 border border-gray-200 text-gray-500 text-xs rounded-full">
              {study.subject.name}
            </span>
          )}
          {study.difficulty && (
            <span className="px-3 py-1 border border-gray-200 text-gray-500 text-xs rounded-full">
              {study.difficulty.name}
            </span>
          )}
        </div>

        <h3 className="text-[17px] font-bold text-gray-900 mb-4 line-clamp-2 leading-[1.4] h-12">
          {study.title}
        </h3>

        <div className="mt-auto flex items-center text-sm text-gray-500">
          <svg className="w-4 h-4 mr-1.5 opacity-50" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <span>현재 <b className="text-primary font-bold">{study.participant_count ?? 0}명</b>이 신청했어요.</span>
        </div>
      </div>
    </div>
  );
};

export default StudyCard;