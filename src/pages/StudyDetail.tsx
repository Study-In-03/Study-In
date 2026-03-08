import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useAssociateGuard } from "@/hooks/useAssociateGuard";

import heartIcon from "@/assets/base/icon-heart.svg";
import heartFillIcon from "@/assets/base/icon-heart-fill.svg";
import shareIcon from "@/assets/base/icon-Share.svg";
import crownIcon from "@/assets/base/icon-crown-fill.svg";

import CommentSection from "@/features/comments/components/CommentSection";

/* ========================
   TYPES
======================== */

type StudyDetailData = {
  id: number;
  thumbnailUrl: string;
  title: string;
  hashtags: string;
  chips: { label: string }[];
  regionLabel: string;

  schedule: {
    statusLabel: string;
    days: string[];
    startDateLabel: string;
    startDateValue: string;
    timeLabel: string;
    timeValue: string;
    timeSubValue: string;
    capacityLabel: string;
    capacityValue: string;
  };

  introTitle: string;
  introBody: string;
};

type CommentItem = {
  id: number;
  author: string;
  date: string;
  body: string;
  isReply?: boolean;
  leaderReply?: boolean;
};

/* ========================
   PAGE
======================== */

export default function StudyDetail() {
  const { studyId } = useParams<{ studyId: string }>();

  const [liked, setLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const { withAssociateGuard } = useAssociateGuard();

  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  const data: StudyDetailData | null = useMemo(() => {
    if (!studyId) return null;

    return {
      id: Number(studyId),

      thumbnailUrl:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",

      title:
        "크롬 확장 프로그램 함께 구현 해보실 분 찾습니다.\n(맞춤법 검사, 번역 서비스입니다.)",

      hashtags: "#Python #Google #크롬확장프로그램 #구현프로젝트",

      chips: [{ label: "프로젝트" }, { label: "초급" }],

      regionLabel: "노형동",

      schedule: {
        statusLabel: "모집 중! (D-10)",
        days: ["수", "금", "토"],

        startDateLabel: "시작일",
        startDateValue: "2022.03.29",

        timeLabel: "시간",
        timeValue: "14:00 ~ 16:00",
        timeSubValue: "8주 / 총 24회",

        capacityLabel: "모집 인원",
        capacityValue: "8 / 10",
      },

      introTitle: "스터디 소개",

      introBody:
        "이 스터디는 파이썬 문법을 시작하다가 포기한 여러분들을 위하여 만들어진 스터디 입니다.\n\n부담 없이 오셔서 같이 공부해요!",
    };
  }, [studyId]);

  const comments: CommentItem[] = [
    {
      id: 1,
      author: "주커버그사촌동생",
      date: "2022.03.23",
      body: "주말에는 계획 없나요?",
    },
    {
      id: 2,
      author: "파이썬마술사",
      date: "2022.03.23",
      body: "주말은 어려워요 ㅠㅠ",
      isReply: true,
      leaderReply: true,
    },
  ];

  const [commentList, setCommentList] = useState(comments);

  if (!data) return null;

  const primaryButtonText = isJoined ? "채팅방 가기" : "참여하기";

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now(),
      author: "나",
      date: "오늘",
      body: commentText,
    };

    setCommentList((prev) => [newComment, ...prev]);

    setCommentText("");
    setIsCommentOpen(false);
  };

  const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="w-full bg-gray-100">

      {/* CONTENT */}
      <div className="mx-auto max-w-[390px] px-4 pb-[120px] pt-4">

        {/* TOP CARD */}
        <section className="rounded-xl border bg-background">

          <div className="flex gap-2 p-4">
            {data.chips.map((c) => (
              <TagChip key={c.label} label={c.label} />
            ))}

            <TagChip label={data.regionLabel} />
          </div>

          <img
            src={data.thumbnailUrl}
            className="h-[358px] w-full object-cover"
          />

          <div className="p-4">

            <h1 className="whitespace-pre-line text-xl font-bold">
              {data.title}
            </h1>

            <p className="mt-2 text-base text-primary-light">
              {data.hashtags}
            </p>

          </div>
        </section>

        {/* SCHEDULE */}
        <section className="mt-4 rounded-xl border bg-background">

          <div className="bg-primary-light p-4 font-semibold text-white">
            {data.schedule.statusLabel}
          </div>

          <div className="p-5">

            <h2 className="text-center text-xl font-bold">
              스터디 일정
            </h2>

            <div className="mt-4 flex justify-between">

              {DAYS.map((d) => {

                const active = data.schedule.days.includes(d);

                return (
                  <div
                    key={d}
                    className={`h-[30px] w-[30px] flex items-center justify-center rounded-full text-sm
                    ${
                      active
                        ? "bg-primary-light text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t" />

            <InfoRow
              left={data.schedule.startDateLabel}
              right={data.schedule.startDateValue}
            />

            <div className="border-t" />

            <InfoRow
              left={data.schedule.timeLabel}
              right={data.schedule.timeValue}
              subRight={data.schedule.timeSubValue}
            />

            <div className="border-t" />

            <InfoRow
              left={data.schedule.capacityLabel}
              right={data.schedule.capacityValue}
              bold
            />

          </div>
        </section>

        {/* INTRO */}
        <section className="mt-4 rounded-xl border bg-background p-4">

          <h2 className="text-xl font-bold">
            {data.introTitle}
          </h2>

          <p className="mt-2 whitespace-pre-line text-base">
            {data.introBody}
          </p>

        </section>

        {/* COMMENTS */}
        <section className="mt-4 rounded-xl border bg-background p-4">

          <h2 className="text-xl font-bold">
            그룹장에게 질문하기
          </h2>

          <section className="mt-6">
            <CommentSection studyPk={data.id} />
          </section>


          <button
            onClick={() => setIsCommentOpen(true)}
            className="mt-3 w-full rounded border border-gray-300 p-2"
          >
            작성하기
          </button>

          <div className="mt-4 space-y-4">

            {commentList.map((c) => (

              <div key={c.id}>

                <p className="flex items-center gap-1 font-bold text-sm">
                  {c.author}
                  {c.leaderReply && (
                    <img src={crownIcon} className="w-4 h-4" />
  )}
</p>

                <p className="text-xs text-gray-500">
                  {c.date}
                </p>

                <p className="text-sm">
                  {c.body}
                </p>

              </div>

            ))}
          </div>
        </section>

      </div>

      {/* COMMENT SHEET */}

      {isCommentOpen && (

        <div className="fixed inset-0 flex items-end bg-black/40">

          <div className="mx-auto w-full max-w-[390px] rounded-t-2xl bg-background p-4">

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full rounded border p-2"
            />

            <div className="mt-4 flex gap-2">

              <button
                onClick={() => setIsCommentOpen(false)}
                className="flex-1 rounded border p-2"
              >
                취소
              </button>

              <button
                onClick={handleSubmitComment}
                className="flex-1 rounded bg-primary p-2 text-white"
              >
                등록
              </button>

            </div>

          </div>
        </div>
      )}

      {/* BOTTOM BAR */}

      <div className="fixed bottom-0 left-0 right-0 border-t bg-background">

        <div className="mx-auto flex h-[70px] max-w-[390px] items-center gap-2 px-4">

          {/* SHARE */}
          <button className="flex h-[50px] w-[110px] items-center justify-center gap-2 rounded-lg border border-gray-300 bg-background text-base">
            <img src={shareIcon} className="h-5 w-5" />
            공유
          </button>

          {/* HEART */}
          <button
            onClick={() => setLiked((p) => !p)}
            className="flex h-[50px] w-[50px] items-center justify-center rounded-lg border border-gray-300"
          >
            <img
              src={liked ? heartFillIcon : heartIcon}
              className="h-5 w-5"
            />
          </button>

          {/* JOIN */}
          <button
            onClick={() => withAssociateGuard(() => setIsJoined((p) => !p))}
            className="h-[50px] w-[186px] rounded-lg bg-primary text-white"
          >
            {primaryButtonText}
          </button>

        </div>
      </div>

    </div>
  );
}

/* ========================
   UI
======================== */

function TagChip({ label }: { label: string }) {
  return (
    <div className="rounded-full bg-gray-100 px-3 py-1 text-sm">
      {label}
    </div>
  );
}

function InfoRow({
  left,
  right,
  subRight,
  bold,
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

        <div className={bold ? "font-bold" : ""}>
          {right}
        </div>

        {subRight && (
          <div className="text-xs text-gray-500">
            {subRight}
          </div>
        )}

      </div>
    </div>
  );
}