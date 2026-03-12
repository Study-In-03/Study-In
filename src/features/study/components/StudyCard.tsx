import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Study } from "../../../types/study";
import { likeStudy, unlikeStudy } from "@/api/study";
import { STATUS_COLOR } from "@/constants/study";
import IconSpeaker from "@/assets/base/icon-speaker.svg?react";
import IconPeople from "@/assets/base/icon-people.svg?react";
import HeartIcon from "@/assets/base/icon-heart.svg?react";
import HeartFillIcon from "@/assets/base/icon-heart-fill.svg?react";
import defaultThumbnail from "@/assets/base/User-Profile-L.svg";

interface StudyCardProps {
  study: Study;
  large?: boolean;
}

const StudyCard = ({ study, large = false }: StudyCardProps) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(study.is_liked);
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

  return (
    <div
      onClick={() => navigate(`/study/${study.id}`)}
      className="flex flex-col bg-background border border-gray-300 rounded-[10px] overflow-hidden cursor-pointer"
    >
      {/* 상단: 상태 뱃지 + 지역 태그 */}
      <div className="flex items-center justify-between px-[10px] h-[38px] shrink-0">
        <div className="flex items-center gap-1">
          <IconSpeaker className={`w-4 h-4 ${STATUS_COLOR[study.status] ?? "text-gray-400"}`} />
          <span className={`text-sm font-bold md:text-lg md:font-normal ${STATUS_COLOR[study.status] ?? "text-gray-400"}`}>
            {study.status === "모집 중" ? "모집 중!" : study.status === "완료" ? "종료" : study.status}
          </span>
        </div>
        <span className="text-xs md:text-sm bg-gray-100 rounded-full px-[10px] py-[2px] text-gray-700">
          {study.location ?? "온라인"}
        </span>
      </div>

      {/* 썸네일 */}
      <div className="relative aspect-square bg-gray-100 border-y border-gray-300 shrink-0">
        <img
          src={study.thumbnail || defaultThumbnail}
          onError={(e) => { e.currentTarget.src = defaultThumbnail; }}
          className={study.thumbnail ? "w-full h-full object-cover" : "absolute inset-0 m-auto w-2/3 h-2/3 object-contain opacity-40"}
          alt="스터디 썸네일"
        />
        {/* 종료 오버레이 */}
        {study.status === "완료" && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-background text-sm font-medium">종료된 스터디입니다 :)</span>
          </div>
        )}
        {/* 하트 버튼 */}
        <button
          aria-label={isLiked ? "관심 스터디 해제" : "관심 스터디 추가"}
          onClick={handleLike}
          disabled={isLikeLoading}
          className="absolute bottom-3 right-[10px] w-8 h-8 bg-background rounded-full flex items-center justify-center drop-shadow-[2px_2px_6px_rgba(0,0,0,0.1)]"
        >
          {isLiked ? (
            <HeartFillIcon className="w-[22px] h-[22px] text-error" />
          ) : (
            <HeartIcon className="w-[22px] h-[22px] text-gray-300" />
          )}
        </button>
      </div>

      {/* 태그 (주제 + 난이도) */}
      <div className="flex gap-1 px-[10px] mt-[10px] flex-wrap">
        {study.topic && (
          <span className="text-xs md:text-sm border border-gray-300 rounded-full px-[10px] py-[2px] text-gray-700">
            {study.topic}
          </span>
        )}
        {study.difficulty && (
          <span className="text-xs md:text-sm border border-gray-300 rounded-full px-[10px] py-[2px] text-gray-700">
            {study.difficulty}
          </span>
        )}
      </div>

      {/* 제목 */}
      <p className={`px-[10px] mt-[10px] text-base md:text-xl ${large ? "font-bold" : "font-medium"} text-surface line-clamp-2 leading-5`}>
        {study.title}
      </p>

      {/* 참여 인원 */}
      <div className="flex items-center gap-1 px-[10px] mt-auto pt-2 pb-3">
        <IconPeople className="w-[14px] h-[14px] text-gray-500 shrink-0" />
        <span className="text-sm md:text-base text-gray-500">
          현재 <b className="text-primary font-medium">{study.current_participants}명</b>이 신청했어요.
        </span>
      </div>
    </div>
  );
};

export default StudyCard;
