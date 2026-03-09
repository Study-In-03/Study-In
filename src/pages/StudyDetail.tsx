import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from '@/api/axios';
import { storage } from '@/utils/storage';
import { StudyApiData, likeStudy, unlikeStudy } from '@/api/study';
import { useAssociateGuard } from '@/hooks/useAssociateGuard';

import heartIcon from "@/assets/base/icon-heart.svg";
import heartFillIcon from "@/assets/base/icon-heart-fill.svg";
import shareIcon from "@/assets/base/icon-Share.svg";

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

        // 참여 여부 초기값
        const alreadyJoined = response.data.participants.some((p: any) => p.id === myPk);
        if (alreadyJoined) setIsJoined(true);

        // 좋아요 초기값: like_users 배열에 내 pk가 있으면 true
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
      // 409: 이미 좋아요 상태 / 이미 취소 상태 → 로컬 state만 동기화
      if (error.response?.status === 409) {
        setLiked((p) => !p);
      }
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
  const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="w-full bg-gray-100">

      <div className="mx-auto max-w-[390px] px-4 pb-[120px] pt-4">

        {/* TOP CARD */}
        <section className="rounded-xl border bg-background">
          <div className="flex gap-2 p-4">
            <TagChip label={studyDetail.subject.name} />
            <TagChip label={studyDetail.difficulty.name} />
            {studyDetail.study_location && <TagChip label={studyDetail.study_location.location} />}
          </div>

          <img src={studyDetail.thumbnail} className="h-[358px] w-full object-cover" />

          <div className="p-4">
            <h1 className="whitespace-pre-line text-xl font-bold">{studyDetail.title}</h1>
            <p className="mt-2 text-base text-primary-light">
              {studyDetail.search_tag.map((tag: { id: number; name: string }) => (
                <span key={tag.id}>#{tag.name} </span>
              ))}
            </p>
          </div>
        </section>

        {/* SCHEDULE */}
        <section className="mt-4 rounded-xl border bg-background">
          <div className="bg-primary-light p-4 font-semibold text-background">
            {studyDetail.study_status.name}
          </div>

          <div className="p-5">
            <h2 className="text-center text-xl font-bold">스터디 일정</h2>

            <div className="mt-4 flex justify-between">
              {DAYS.map((d) => {
                const active = studyDetail.study_day.some((day) => day.name === d);
                return (
                  <div
                    key={d}
                    className={`h-[30px] w-[30px] flex items-center justify-center rounded-full text-sm ${
                      active ? "bg-primary-light text-background" : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t" />
            <InfoRow left="시작일" right={studyDetail.start_date} />
            <div className="border-t" />
            <InfoRow
              left="시간"
              right={`${studyDetail.start_time.slice(0, 5)} ~ ${studyDetail.end_time.slice(0, 5)}`}
              subRight={`${studyDetail.term}주 진행`}
            />
            <div className="border-t" />
            <InfoRow
              left="모집 인원"
              right={`${studyDetail.participants.length} / ${studyDetail.recruitment}`}
              bold
            />
          </div>
        </section>

        {/* INTRO */}
        <section className="mt-4 rounded-xl border bg-background p-4">
          <h2 className="text-xl font-bold">스터디 소개</h2>
          <p className="mt-2 whitespace-pre-line text-base">{studyDetail.study_info}</p>
        </section>

        {/* COMMENTS */}
        <section className="mt-4 rounded-xl border bg-background p-4">
          <h2 className="text-xl font-bold">그룹장에게 질문하기</h2>
          <div className="mt-6">
            <CommentSection studyPk={studyDetail.id} />
          </div>
        </section>

      </div>

      {/* BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
        <div className="mx-auto flex h-[70px] max-w-[390px] items-center gap-2 px-4">

          <button className="flex h-[50px] w-[110px] items-center justify-center gap-2 rounded-lg border border-gray-300 bg-background text-base">
            <img src={shareIcon} className="h-5 w-5" />
            공유
          </button>

          <button
            onClick={handleLike}
            disabled={isLikeLoading}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-300"
          >
            <img src={liked ? heartFillIcon : heartIcon} className="h-5 w-5" />
          </button>

          <button
            onClick={() => withAssociateGuard(handleJoinOrChat)}
            className="h-[50px] w-[186px] rounded-lg bg-primary text-background"
          >
            {primaryButtonText}
          </button>

        </div>
      </div>

    </div>
  );
}

function TagChip({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">{label}</div>
  );
}

function InfoRow({
  left, right, subRight, bold,
}: {
  left: string;
  right: string;
  subRight?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between py-3">
      <div>{left}</div>
      <div className="text-right">
        <div className={bold ? "font-bold" : ""}>{right}</div>
        {subRight && <div className="text-xs text-gray-500">{subRight}</div>}
      </div>
    </div>
  );
}