import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from '@/api/axios';
import { storage } from '@/utils/storage';
import { StudyApiData, likeStudy, unlikeStudy } from '@/api/study';
import { useAssociateGuard } from '@/hooks/useAssociateGuard';
import { getFullUrl } from '@/api/upload';

import iconRecruiting from "@/assets/base/icon-모집중.svg";
import HeartIcon from "@/assets/base/icon-heart.svg?react";
import HeartFillIcon from "@/assets/base/icon-heart-fill.svg?react";
import ShareIcon from "@/assets/base/icon-Share.svg?react";

import CommentSection from "@/features/comments/components/CommentSection";

export default function StudyDetail() {
  const navigate = useNavigate();
  const { studyId } = useParams<{ studyId: string }>();
  const { withAssociateGuard } = useAssociateGuard();

  const [liked, setLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [studyDetail, setStudyDetail] = useState<StudyApiData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  const myPk = Number(storage.getUserId());
  const isLeader = studyDetail?.leader?.id === myPk;

  useEffect(() => {
    const fetchDetail = async () => {
      if (!studyId) return;
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(`/study/${studyId}/`);
        setStudyDetail(response.data);
        const alreadyJoined = response.data.participants.some((p: any) => p.id === myPk);
        if (alreadyJoined) setIsJoined(true);
        const alreadyLiked = response.data.like_users?.includes(myPk) ?? false;
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
      setLiked((p) => !p);
    } catch (error: any) {
      if (error.response?.status === 409) setLiked((p) => !p);
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
      await axiosInstance.post(`/study/${studyId}/participate/`);
      setIsJoined(true);
      alert("스터디에 성공적으로 참여되었습니다!");
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || "참여 신청 중 오류가 발생했습니다.";
      alert(errorMsg);
      if (error.response?.status === 409) setIsJoined(true);
    }
  };

  if (isLoading) return <div className="p-10 text-center">불러오는 중...</div>;
  if (!studyDetail) return <div className="p-10 text-center">데이터를 찾을 수 없습니다.</div>;

  const primaryButtonText = (isLeader || isJoined) ? "채팅방 가기" : "참여하기";
  const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
  const leaderProfile = studyDetail.leader.profile;
  const leaderImgUrl = leaderProfile.profile_img ? getFullUrl(leaderProfile.profile_img) : null;

  // 웹 오른쪽 사이드카드
  const SideCard = () => (
    <div className="border border-gray-300 rounded-xl overflow-hidden">
      <div className="bg-primary px-4 py-3 flex items-center justify-between">
        <img src={iconRecruiting} alt="모집중" className="h-7" />
        <span className="text-background text-sm font-medium">{studyDetail.study_status.name}</span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between">
          {DAYS.map((d) => {
            const active = studyDetail.study_day.some((day) => day.name === d);
            return (
              <div key={d} className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${active ? "bg-primary text-background" : "bg-gray-100 text-gray-500"}`}>
                {d}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col divide-y divide-gray-100">
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-gray-700">시작일</span>
            <span className="font-medium text-primary">{studyDetail.start_date}</span>
          </div>
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-gray-700">시간</span>
            <div className="text-right">
              <div className="font-medium text-gray-900">{studyDetail.start_time.slice(0, 5)} ~ {studyDetail.end_time.slice(0, 5)}</div>
              <div className="text-xs text-gray-500">{studyDetail.term}주 진행</div>
            </div>
          </div>
          <div className="flex justify-between py-2.5 text-sm">
            <span className="text-gray-700">모집 인원</span>
            <span className="font-bold text-primary">{studyDetail.participants.length} / {studyDetail.recruitment}</span>
          </div>
        </div>
        <button
          onClick={() => withAssociateGuard(handleJoinOrChat)}
          className="w-full h-11 rounded-lg bg-primary text-background font-medium"
        >
          {primaryButtonText}
        </button>
        <div className="flex gap-2">
          <button className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm text-gray-700">
            <ShareIcon className="w-4 h-4" />
            공유하기
          </button>
          <button onClick={handleLike} disabled={isLikeLoading} className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300">
            {liked ? <HeartFillIcon className="w-5 h-5 text-error" /> : <HeartIcon className="w-5 h-5 text-gray-500" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background">

      {/* ── 웹 레이아웃 (md 이상) ── */}
      <div className="hidden md:block">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex gap-6 items-start">
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* 썸네일 + 제목 */}
              <section className="rounded-xl border border-gray-300 bg-background overflow-hidden">
                <img src={studyDetail.thumbnail} alt={studyDetail.title} className="w-full h-[358px] object-cover" />
                <div className="p-4">
                  <div className="flex gap-2 mb-3 flex-wrap">
                    <TagChip label={studyDetail.subject.name} />
                    <TagChip label={studyDetail.difficulty.name} />
                    {studyDetail.study_location && <TagChip label={studyDetail.study_location.location} />}
                  </div>
                  <h1 className="text-xl font-bold text-gray-900 whitespace-pre-line">{studyDetail.title}</h1>
                  <p className="mt-2 text-sm text-primary">
                    {studyDetail.search_tag.map((tag: { id: number; name: string }) => (
                      <span key={tag.id}>#{tag.name} </span>
                    ))}
                  </p>
                </div>
              </section>

              {/* 스터디 소개 */}
              <section className="rounded-xl border border-gray-300 bg-background p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-3">스터디 소개</h2>
                <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{studyDetail.study_info}</p>
              </section>

              {/* 스터디 일정 */}
              {studyDetail.schedule_info && (
                <section className="rounded-xl border border-gray-300 bg-background p-5">
                  <h2 className="text-lg font-bold text-gray-900 mb-3">스터디 일정</h2>
                  <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{studyDetail.schedule_info}</p>
                </section>
              )}

              {/* 그룹장 소개 */}
              <section className="rounded-xl border border-gray-300 bg-background p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">그룹장 소개</h2>
                <div className="flex gap-4 cursor-pointer" onClick={() => navigate(`/profile/${studyDetail.leader.id}`)}>
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 shrink-0">
                    {leaderImgUrl ? <img src={leaderImgUrl} alt={leaderProfile.nickname} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
                  </div>
                  <div className="flex flex-col justify-center gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{leaderProfile.nickname}</span>
                      {studyDetail.study_location && (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{studyDetail.study_location.location}</span>
                      )}
                    </div>
                    {leaderProfile.introduction && <p className="text-sm text-gray-500 line-clamp-2">{leaderProfile.introduction}</p>}
                  </div>
                </div>
                {studyDetail.leader_intro && (
                  <p className="mt-3 text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-3 leading-relaxed">{studyDetail.leader_intro}</p>
                )}
              </section>

              {/* 댓글 */}
              <section className="rounded-xl border border-gray-300 bg-background p-5">
                <h2 className="text-lg font-bold text-gray-900 mb-4">그룹장에게 질문하기</h2>
                <CommentSection studyPk={studyDetail.id} />
              </section>
            </div>

            {/* 오른쪽 사이드카드 sticky */}
            <div className="w-72 shrink-0 sticky top-6">
              <SideCard />
            </div>
          </div>
        </div>
      </div>

      {/* ── 모바일 레이아웃 (md 미만) ── */}
      <div className="md:hidden pb-[80px]">

        {/* 썸네일 (h-[548px]) */}
        <div className="w-full h-[358px] overflow-hidden">
          <img src={studyDetail.thumbnail} alt={studyDetail.title} className="w-full h-full object-cover" />
        </div>

        {/* 제목 + 태그 */}
        <div className="px-4 pt-4 pb-3 bg-background">
          <div className="flex gap-2 mb-2 flex-wrap">
            <TagChip label={studyDetail.subject.name} />
            <TagChip label={studyDetail.difficulty.name} />
            {studyDetail.study_location && <TagChip label={studyDetail.study_location.location} />}
          </div>
          <h1 className="text-lg font-bold text-gray-900 whitespace-pre-line">{studyDetail.title}</h1>
          <p className="mt-1 text-sm text-primary">
            {studyDetail.search_tag.map((tag: { id: number; name: string }) => (
              <span key={tag.id}>#{tag.name} </span>
            ))}
          </p>
        </div>

        {/* 스터디 일정 카드 (썸네일에 붙음) */}
        <div className="bg-background px-4 pb-4">
          <div className="rounded-xl border border-gray-300 overflow-hidden">
            {/* 모집중 헤더 */}
            <div className="bg-primary px-4 py-3 flex items-center gap-3">
              <img src={iconRecruiting} alt="모집중" className="h-7" />
            </div>

            <div className="p-4 flex flex-col gap-3">
              {/* 요일 */}
              <div className="flex justify-between">
                {DAYS.map((d) => {
                  const active = studyDetail.study_day.some((day) => day.name === d);
                  return (
                    <div key={d} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium ${active ? "bg-primary text-background" : "bg-gray-100 text-gray-500"}`}>
                      {d}
                    </div>
                  );
                })}
              </div>

              {/* 일정 정보 */}
              <div className="flex flex-col">
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                  <span className="text-gray-700">시작일</span>
                  <span className="font-medium text-primary">{studyDetail.start_date}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-100 text-sm">
                  <span className="text-gray-700">시간</span>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{studyDetail.start_time.slice(0, 5)} ~ {studyDetail.end_time.slice(0, 5)}</div>
                    <div className="text-xs text-gray-500">{studyDetail.term}주 진행</div>
                  </div>
                </div>
                <div className="flex justify-between py-3 text-sm">
                  <span className="text-gray-700">모집 인원</span>
                  <span className="font-bold text-primary">{studyDetail.participants.length} / {studyDetail.recruitment}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 스터디 소개 - 회색 배경 */}
        <div className="bg-gray-100 px-4 py-4 flex flex-col gap-4">

          <section className="bg-background rounded-xl p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-2">스터디 소개</h2>
            <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{studyDetail.study_info}</p>
          </section>

          {/* 스터디 일정 텍스트 */}
          {studyDetail.schedule_info && (
            <section className="bg-background rounded-xl p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-2">스터디 일정</h2>
              <p className="whitespace-pre-line text-sm text-gray-700 leading-relaxed">{studyDetail.schedule_info}</p>
            </section>
          )}

          {/* 그룹장 소개 */}
          <section className="bg-background rounded-xl p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">그룹장 소개</h2>
            <div className="flex gap-3 cursor-pointer" onClick={() => navigate(`/profile/${studyDetail.leader.id}`)}>
              <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shrink-0">
                {leaderImgUrl ? <img src={leaderImgUrl} alt={leaderProfile.nickname} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200" />}
              </div>
              <div className="flex flex-col justify-center gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm">{leaderProfile.nickname}</span>
                  {studyDetail.study_location && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{studyDetail.study_location.location}</span>
                  )}
                </div>
                {leaderProfile.introduction && <p className="text-xs text-gray-500 line-clamp-2">{leaderProfile.introduction}</p>}
              </div>
            </div>
            {studyDetail.leader_intro && (
              <p className="mt-3 text-sm text-gray-700 bg-gray-100 rounded-lg px-3 py-3 leading-relaxed">{studyDetail.leader_intro}</p>
            )}
          </section>

          {/* 그룹장에게 질문하기 */}
          <section className="bg-background rounded-xl p-4">
            <h2 className="text-lg font-bold text-gray-900 mb-3">그룹장에게 질문하기</h2>
            <CommentSection studyPk={studyDetail.id} />
          </section>

        </div>

        {/* 모바일 하단 바 */}
        <div className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
          <div className="mx-auto flex h-[70px] max-w-[390px] items-center gap-2 px-4">
            <button className="flex h-[50px] w-[110px] items-center justify-center gap-2 rounded-lg border border-gray-300 text-sm text-gray-700">
              <ShareIcon className="w-4 h-4" />
              공유
            </button>
            <button onClick={handleLike} disabled={isLikeLoading} className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-300">
              {liked ? <HeartFillIcon className="w-5 h-5 text-error" /> : <HeartIcon className="w-5 h-5 text-gray-500" />}
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

function TagChip({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">{label}</div>
  );
}