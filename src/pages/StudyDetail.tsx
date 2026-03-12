import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudy, joinStudy } from '@/api/study';
import { storage } from '@/utils/storage';
import { StudyApiData, likeStudy, unlikeStudy } from '@/api/study';
import { useAssociateGuard } from '@/hooks/useAssociateGuard';
import { getFullUrl } from '@/api/upload';

import SpeakerIcon from "@/assets/base/icon-speaker.svg?react";
import HeartIcon from "@/assets/base/icon-heart.svg?react";
import HeartFillIcon from "@/assets/base/icon-heart-fill.svg?react";
import ShareIcon from "@/assets/base/icon-Share.svg?react";
import CrownIcon from "@/assets/base/icon-crown-fill.svg?react";

import CommentSection from "@/features/comments/components/CommentSection";
import { useModalStore } from "@/store/modalStore";

function TagChip({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-gray-300 bg-background px-3 py-1 text-sm text-gray-700">
      {label}
    </div>
  );
}

export default function StudyDetail() {
  const navigate = useNavigate();
  const { studyId } = useParams<{ studyId: string }>();
  const { withAssociateGuard } = useAssociateGuard();
  const { openModal } = useModalStore();

  const [liked, setLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [studyDetail, setStudyDetail] = useState<StudyApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const thumbnailCardRef = useRef<HTMLDivElement>(null);

  const myPk = Number(storage.getUserId());
  const isLeader = studyDetail?.leader?.id === myPk;

  useEffect(() => {
    const fetchDetail = async () => {
      if (!studyId) return;
      try {
        setIsLoading(true);
        const data = await getStudy(Number(studyId));
        setStudyDetail(data);
        const alreadyJoined = data.participants.some((p: any) => p.id === myPk);
        if (alreadyJoined) setIsJoined(true);
        const alreadyLiked = data.like_users?.includes(myPk) ?? false;
        setLiked(alreadyLiked);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [studyId, myPk]);

  const handleLike = async () => {
    if (!studyId || isLikeLoading) return;
    setIsLikeLoading(true);
    try {
      if (liked) {
        await unlikeStudy(Number(studyId));
      } else {
        await likeStudy(Number(studyId));
      }
      setLiked((prev) => !prev);
    } catch (error: any) {
      if (error.response?.status === 409) setLiked((prev) => !prev);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleJoinOrChat = async () => {
    if (!studyId || !studyDetail) return;
    if (isLeader || isJoined) {
      navigate(`/chat/${studyId}`);
      return;
    }
    try {
      await joinStudy(Number(studyId));
      setIsJoined(true);
      alert("스터디에 성공적으로 참여되었습니다!");
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error || "참여 신청 중 오류가 발생했습니다.";
      alert(errorMsg);
      if (error.response?.status === 409) setIsJoined(true);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center text-gray-500">불러오는 중...</div>;
  if (!studyDetail)
    return (
      <div className="p-10 text-center text-gray-500">
        데이터를 찾을 수 없습니다.
      </div>
    );

  const primaryButtonText = isLeader || isJoined ? "채팅방 가기" : "참여하기";
  const DAYS_ORDER = ["월", "화", "수", "목", "금", "토", "일"];
  const leaderProfile = studyDetail.leader.profile;
  const leaderImgUrl = leaderProfile.profile_img
    ? getFullUrl(leaderProfile.profile_img)
    : null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}(${dayNames[d.getDay()]})`;
  };

  return (
    <div className="w-full min-h-screen bg-background">

      <div className="hidden md:block">

        <div className="mx-auto max-w-[1190px] px-6 pr-[60px] pt-6">
          <div
            ref={thumbnailCardRef}
            className="rounded-xl border border-gray-300 bg-background overflow-hidden"
          >
            <div className="flex h-[390px]">
              <div className="w-[300px] shrink-0">
                <img
                  src={getFullUrl(studyDetail.thumbnail)}
                  alt={studyDetail.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 px-5 py-5 flex flex-col">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                      <TagChip label={studyDetail.subject.name} />
                      <TagChip label={studyDetail.difficulty.name} />
                    </div>
                    {studyDetail.study_location && (
                      <span className="text-xs bg-gray-100 rounded-full px-[10px] py-[2px] text-gray-700 shrink-0">
                        {studyDetail.study_location.location}
                      </span>
                    )}
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 leading-snug">
                    {studyDetail.title}
                  </h1>
                </div>

                {studyDetail.search_tag.length > 0 && (
                  <p className="flex-1 flex items-end text-sm text-primary">
                    {studyDetail.search_tag.map((tag) => (
                      <span key={tag.id}>#{tag.name} </span>
                    ))}
                  </p>
                )}
                {studyDetail.search_tag.length === 0 && (
                  <div className="flex-1" />
                )}

                <div className="flex justify-end gap-2">
                  <button className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 h-9 text-sm text-gray-700">
                    <ShareIcon className="w-4 h-4" />
                    공유하기
                  </button>
                  <button
                    onClick={handleLike}
                    disabled={isLikeLoading}
                    className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300"
                  >
                    {liked
                      ? <HeartFillIcon className="w-4 h-4 text-error" />
                      : <HeartIcon className="w-4 h-4 text-gray-500" />
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[1190px] px-6 pr-[60px] pt-10 pb-6 flex gap-6 items-start">

          <div className="flex-1 min-w-0">
            <div className="py-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">스터디 소개</h2>
              <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                {studyDetail.study_info}
              </p>
            </div>

            <div className="border-t border-gray-300" />

            <div className="py-5">
              <h2 className="text-base font-bold text-gray-900 mb-3">스터디 일정</h2>
              {studyDetail.schedule_info
                ? (
                  <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                    {studyDetail.schedule_info}
                  </p>
                )
                : <p className="text-sm text-gray-300">일정 정보가 없습니다.</p>
              }
            </div>

            <div className="border-t border-gray-300" />

            <div className="py-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">그룹장 소개</h2>
              <div
                className="cursor-pointer flex gap-4"
                onClick={() => openModal("user-info", studyDetail.leader.id)}
              >
                <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-100 shrink-0">
                  {leaderImgUrl
                    ? (
                      <img
                        src={leaderImgUrl}
                        alt={leaderProfile.nickname}
                        className="w-full h-full object-cover"
                      />
                    )
                    : <div className="w-full h-full bg-gray-100" />
                  }
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">
                      {leaderProfile.nickname}
                    </span>
                    <CrownIcon className="w-4 h-4 text-primary" />
                    {studyDetail.study_location && (
                      <span className="text-xs bg-gray-100 rounded-full px-[10px] py-[2px] text-gray-700 ml-1">
                        {studyDetail.study_location.location}
                      </span>
                    )}
                  </div>
                  {leaderProfile.introduction && (
                    <div
                      className="bg-[#FFE187] px-4 py-3"
                      style={{ borderRadius: "0px 16px 16px 16px" }}
                    >
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {leaderProfile.introduction}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-300" />

            <div className="py-5">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                그룹장에게 질문하기
              </h2>
              <div className="flex flex-col gap-4">
                <CommentSection studyPk={studyDetail.id} />
              </div>
            </div>
          </div>
          <div className="w-[290px] shrink-0 sticky top-6 self-start">
            <div className="rounded-xl border border-gray-300 overflow-hidden bg-background">
              <div className="bg-primary px-4 py-3 flex items-center gap-2">
                <SpeakerIcon className="h-5 w-5 text-background shrink-0" />
                <span className="text-background text-sm font-semibold">
                  {studyDetail.study_status.name}
                </span>
              </div>
              <div className="px-4 py-4 flex flex-col gap-3">
                <p className="text-center text-base font-bold text-gray-900">
                  스터디 일정
                </p>
                <div className="flex justify-between">
                  {DAYS_ORDER.map((d) => {
                    const active = studyDetail.study_day.some(
                      (day) => day.name === d
                    );
                    return (
                      <div
                        key={d}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium
                          ${active
                            ? "bg-primary text-background"
                            : "bg-gray-100 text-gray-400"
                          }`}
                      >
                        {d}
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-primary font-medium">시작일</span>
                  <span className="text-primary font-medium">
                    {studyDetail.start_date}
                  </span>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex justify-between items-start text-sm">
                  <span className="text-gray-700">시간</span>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      {studyDetail.start_time.slice(0, 5)} ~{" "}
                      {studyDetail.end_time.slice(0, 5)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {studyDetail.term}주 진행
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-100" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-700">모집 인원</span>
                  <span>
                    <span className="font-bold text-primary">
                      {studyDetail.participants.length}
                    </span>
                    <span className="text-gray-900">
                      /{studyDetail.recruitment}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => withAssociateGuard(handleJoinOrChat)}
                  className="w-full h-11 rounded-lg bg-primary text-background font-semibold text-sm"
                >
                  {primaryButtonText}
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm text-gray-700">
                    <ShareIcon className="w-4 h-4" />
                    공유하기
                  </button>
                  <button
                    onClick={handleLike}
                    disabled={isLikeLoading}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300"
                  >
                    {liked
                      ? <HeartFillIcon className="w-5 h-5 text-error" />
                      : <HeartIcon className="w-5 h-5 text-gray-500" />
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="md:hidden pb-[80px]">

        <div className="mx-6 mt-4 rounded-xl border border-gray-300 overflow-hidden bg-background">
          <div className="px-4 pt-3 pb-2 flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <TagChip label={studyDetail.subject.name} />
              <TagChip label={studyDetail.difficulty.name} />
            </div>
            {studyDetail.study_location && (
              <span className="text-xs bg-gray-100 rounded-full px-[10px] py-[2px] text-gray-700 flex-shrink-0">
                {studyDetail.study_location.location}
              </span>
            )}
          </div>
          <div className="w-full h-[280px] overflow-hidden bg-gray-100">
            <img
              src={getFullUrl(studyDetail.thumbnail)}
              alt={studyDetail.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="px-4 pt-3 pb-4">
            <h1 className="text-lg font-bold text-gray-900 whitespace-pre-line">
              {studyDetail.title}
            </h1>
            {studyDetail.search_tag.length > 0 && (
              <p className="mt-1 text-sm text-primary">
                {studyDetail.search_tag.map((tag) => (
                  <span key={tag.id}>#{tag.name} </span>
                ))}
              </p>
            )}
          </div>
        </div>

        <div className="mx-6 mt-3 bg-primary rounded-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3">
            <SpeakerIcon className="h-5 w-5 text-background" />
            <span className="text-background font-semibold text-sm">
              {studyDetail.study_status.name}
            </span>
          </div>
          <div className="bg-background rounded-t-2xl border border-gray-300 px-4 py-4 flex flex-col gap-3">
            <h3 className="text-center text-sm font-medium text-gray-900">
              스터디 일정
            </h3>
            <div className="flex justify-between">
              {DAYS_ORDER.map((d) => {
                const active = studyDetail.study_day.some(
                  (day: { name: string }) => day.name === d
                );
                return (
                  <div
                    key={d}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium
                      ${active
                        ? "bg-primary text-background"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-300" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-primary font-bold">시작일</span>
              <span className="text-primary font-medium">
                {formatDate(studyDetail.start_date)}
              </span>
            </div>
            <div className="border-t border-gray-300" />
            <div className="flex justify-between items-start text-sm">
              <span className="text-gray-700 font-bold">시간</span>
              <div className="text-right">
                <div className="text-gray-900">
                  오후 {studyDetail.start_time.slice(0, 2)}시 ~{" "}
                  {studyDetail.end_time.slice(0, 2)}시
                </div>
                <div className="text-xs text-gray-500">{studyDetail.term}주 진행</div>
              </div>
            </div>
            <div className="border-t border-gray-300" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-700 font-bold">모집 인원</span>
              <span>
                <span className="font-bold text-primary">
                  {studyDetail.participants.length}
                </span>
                <span className="text-gray-900">/{studyDetail.recruitment}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="h-2 bg-gray-100 mt-3" />

        <div className="bg-background px-4 py-4 flex flex-col gap-0">

          <section className="py-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">스터디 소개</h2>
            <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
              {studyDetail.study_info}
            </p>
          </section>

          <div className="h-[2px] bg-gray-100 -mx-4" />

          <section className="py-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">스터디 일정</h2>
            {studyDetail.schedule_info
              ? (
                <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">
                  {studyDetail.schedule_info}
                </p>
              )
              : <p className="text-sm text-gray-300">일정 정보가 없습니다.</p>
            }
          </section>

          <div className="h-[2px] bg-gray-100 -mx-4" />

          <section className="py-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">그룹장 소개</h2>
            <div
              className="cursor-pointer flex gap-3"
              onClick={() => openModal("user-info", studyDetail.leader.id)}
            >
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden bg-gray-100 shrink-0">
                {leaderImgUrl
                  ? (
                    <img
                      src={leaderImgUrl}
                      alt={leaderProfile.nickname}
                      className="w-full h-full object-cover"
                    />
                  )
                  : <div className="w-full h-full bg-gray-100" />
                }
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-gray-900 text-sm">
                    {leaderProfile.nickname}
                  </span>
                  <CrownIcon className="w-4 h-4 text-primary" />
                  {leaderProfile.preferred_region && (
                    <span className="text-xs bg-gray-100 rounded-full px-[10px] py-[2px] text-gray-700 ml-1">
                      {leaderProfile.preferred_region.location}
                    </span>
                  )}
                </div>
                {leaderProfile.introduction && (
                  <div
                    className="bg-[#FFE187] px-4 py-3"
                    style={{ borderRadius: "0px 16px 16px 16px" }}
                  >
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {leaderProfile.introduction}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="h-2 bg-gray-100 -mx-4" />

          <section className="py-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">
              그룹장에게 질문하기
            </h2>
            <div className="flex flex-col gap-4">
              <CommentSection studyPk={studyDetail.id} />
            </div>
          </section>

        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300 bg-background z-10">
          <div className="mx-auto flex h-[70px] max-w-[390px] items-center gap-2 px-4">
            <button className="flex h-[50px] w-[110px] items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm text-gray-700">
              <ShareIcon className="w-4 h-4" />
              공유
            </button>
            <button
              onClick={handleLike}
              disabled={isLikeLoading}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-300"
            >
              {liked
                ? <HeartFillIcon className="w-5 h-5 text-error" />
                : <HeartIcon className="w-5 h-5 text-gray-500" />
              }
            </button>
            <button
              onClick={() => withAssociateGuard(handleJoinOrChat)}
              className="h-[50px] flex-1 rounded-lg bg-primary text-background font-medium"
            >
              {primaryButtonText}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}