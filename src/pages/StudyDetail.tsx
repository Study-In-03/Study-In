import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import heartIcon from "@/assets/base/icon-heart.svg";
import heartFillIcon from "@/assets/base/icon-heart-fill.svg";

type StudyDetailData = {
  id: number;
  thumbnailUrl: string;
  title: string;
  hashtags: string;
  chips: { label: string }[];
  schedule: {
    startDateLabel: string; // "시작일"
    startDateValue: string; // "2022.03.29(화)" 같은 형태
    timeLabel: string; // "시간"
    timeValue: string; // "오후 14시~16시"
    capacityLabel: string; // "모집 인원"
    capacityValue: string; // "8/10"
  };
  introTitle: string;
  introBody1: string;
  introBody2: string;
  planTitle: string;
  planItems: string[];
  leader: {
    nickname: string;
    badge: string; // "노션"
    profileImageUrl: string;
    bubble: string;
  };
  questionTitle: string;
  questionPlaceholder: string;
};

export default function StudyDetail() {
  const { studyId } = useParams<{ studyId: string }>();

  const [liked, setLiked] = useState(false);
  const [isJoined, setIsJoined] = useState(false);

  // 더미 플래그(나중에 API 연결)
  const isMember = true;
  const isLeader = false;
  const isFull = false;

  const data: StudyDetailData | null = useMemo(() => {
    if (!studyId) return null;

    return {
      id: Number(studyId),
      thumbnailUrl:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60",
      title: "크롬 확장 프로그램 함께 구현 해보실 분 찾습니다.\n(맞춤법 검사, 번역 서비스입니다.)",
      hashtags: "#Python #Google #크롬확장프로그램 #협업프로젝트",
      chips: [{ label: "프로젝트" }, { label: "중급" }, { label: "오프라인" }],
      schedule: {
        startDateLabel: "시작일",
        startDateValue: "2026-03-03",
        timeLabel: "시간",
        timeValue: "19:00 ~ 21:00",
        capacityLabel: "모집 인원",
        capacityValue: "8/10",
      },
      introTitle: "스터디 소개",
      introBody1:
        "이 스터디는 같이 만들면서 시작합니다! 자기만의 리얼트를 위해서 함께하는 스터디입니다. 일단 해보고, 기간/규칙은 합의해요.",
      introBody2: "취업용 하는 거 아니고, 같이 하니까 하는 거예요. 부담 없이 오세요.",
      planTitle: "스터디 일정",
      planItems: [
        "1주차: 개발 환경 셋팅",
        "2주차: 핵심 기능 구현",
        "3주차: API 연동 / 상태관리",
        "4주차: 테스트 / 리팩토링",
        "5주차: 배포 / 문서화",
      ],
      leader: {
        nickname: "파이썬 마술사",
        badge: "노션",
        profileImageUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=60",
        bubble:
          "안녕하세요! 파이썬마술사입니다.\n\n스터디는 편하게 시작하고, 같이 정리하면서 성장해요.\n\n부담 없이 오셔서 함께 재미있게 만들어봐요!",
      },
      questionTitle: "그룹장에게 질문하기",
      questionPlaceholder:
        "다른 사람의 권리를 침해하거나 운영에 위반되는 댓글은 관리될 수 있습니다.",
    };
  }, [studyId]);

  if (!data) return <div className="px-4 py-6">잘못된 접근입니다.</div>;

  // 버튼 비활성 사유
  const joinDisabledReason = !isMember
    ? "정회원만 참가할 수 있어요."
    : isFull
      ? "모집 인원이 마감되었어요."
      : null;

  const leaveDisabledReason = isLeader ? "스터디장은 탈퇴할 수 없어요." : null;

  const actionDisabled = isJoined
    ? Boolean(leaveDisabledReason)
    : Boolean(joinDisabledReason);

  const helperText = isJoined ? leaveDisabledReason : joinDisabledReason;

  const handleJoinToggle = () => {
    if (actionDisabled) return;
    setIsJoined((prev) => !prev);
  };

  const joinButtonText = isJoined ? "탈퇴하기" : "참가하기";

  return (
    <div className="w-full bg-background">
      {/* ✅ 피그마 모바일 기준: 상단 여백 + 가운데 정렬(최대폭) */}
      <div className="mx-auto w-full max-w-[390px] px-4 pb-[92px] pt-4">
        {/* 칩(프로젝트/중급/오프라인) */}
        <div className="mb-3 flex flex-wrap gap-2">
          {data.chips.map((c) => (
            <span
              key={c.label}
              className="rounded-full bg-gray-100 px-3 py-[6px] text-xs font-medium text-gray-900"
            >
              {c.label}
            </span>
          ))}
        </div>

        {/* 썸네일 */}
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={data.thumbnailUrl}
            alt="thumbnail"
            className="h-[190px] w-full object-cover"
          />
        </div>

        {/* 제목 + 해시태그 */}
        <h1 className="mt-4 whitespace-pre-line text-[18px] font-bold leading-[1.35] text-gray-900">
          {data.title}
        </h1>
        <p className="mt-2 text-[12px] font-medium text-gray-500">{data.hashtags}</p>

        {/* ✅ 일정 카드 */}
        <section className="mt-4 rounded-2xl border border-gray-200 bg-background p-4 shadow-sm">
          {/* 상단 라벨(모집(0~10) 같은 자리) */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-semibold text-primary">모집 중 (0~10)</p>
          </div>

          <h2 className="text-[15px] font-bold text-gray-900">스터디 일정</h2>

          <div className="mt-3 grid gap-2 text-[13px] text-gray-900">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{data.schedule.startDateLabel}</span>
              <span className="font-medium">{data.schedule.startDateValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{data.schedule.timeLabel}</span>
              <span className="font-medium">{data.schedule.timeValue}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">{data.schedule.capacityLabel}</span>
              <span className="font-semibold">{data.schedule.capacityValue}</span>
            </div>
          </div>
        </section>

        {/* ✅ 스터디 소개 카드 */}
        <section className="mt-4 rounded-2xl border border-gray-200 bg-background p-4 shadow-sm">
          <h2 className="text-[15px] font-bold text-gray-900">{data.introTitle}</h2>
          <p className="mt-3 whitespace-pre-line text-[13px] leading-[1.6] text-gray-700">
            {data.introBody1}
          </p>
          <p className="mt-3 whitespace-pre-line text-[13px] leading-[1.6] text-gray-700">
            {data.introBody2}
          </p>
        </section>

        {/* ✅ 스터디 일정(리스트) 카드 */}
        <section className="mt-4 rounded-2xl border border-gray-200 bg-background p-4 shadow-sm">
          <h2 className="text-[15px] font-bold text-gray-900">{data.planTitle}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[13px] text-gray-800">
            {data.planItems.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>

        {/* ✅ 그룹장 소개 카드 */}
        <section className="mt-4 rounded-2xl border border-gray-200 bg-background p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={data.leader.profileImageUrl}
              alt="leader"
              className="h-10 w-10 rounded-full object-cover"
            />
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-bold text-gray-900">{data.leader.nickname}</p>
              <span className="rounded-full bg-gray-100 px-2 py-[2px] text-[11px] font-semibold text-gray-700">
                {data.leader.badge}
              </span>
            </div>
          </div>

          {/* 말풍선(피그마 느낌) */}
          <div className="mt-3 rounded-2xl bg-[#F3E8A6] px-4 py-4">
            <p className="whitespace-pre-line text-[13px] font-semibold leading-[1.6] text-gray-900">
              {data.leader.bubble}
            </p>
          </div>
        </section>

        {/* ✅ 질문하기 카드 */}
        <section className="mt-4 rounded-2xl border border-gray-200 bg-background p-4 shadow-sm">
          <h2 className="text-[15px] font-bold text-gray-900">{data.questionTitle}</h2>
          <div className="mt-3 rounded-2xl bg-gray-50 p-4">
            <p className="text-[12px] leading-[1.55] text-gray-500">
              {data.questionPlaceholder}
            </p>
          </div>
        </section>

        {/* 조건 안내 */}
        {helperText ? (
          <p className="mt-3 text-[12px] text-gray-500">{helperText}</p>
        ) : null}
      </div>

      {/* ✅ 하단 고정 바 (피그마: 좌 2개 아이콘 + 우 참가하기 버튼) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-background">
        <div className="mx-auto flex w-full max-w-[390px] items-center gap-3 px-4 py-3">
          {/* 공유(아이콘만 자리) */}
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-background"
            aria-label="공유"
          >
            <span className="text-[14px] text-gray-700">⤴</span>
          </button>

          {/* 좋아요 */}
          <button
            type="button"
            onClick={() => setLiked((prev) => !prev)}
            aria-pressed={liked}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-background"
            aria-label="좋아요"
          >
            <img
              src={liked ? heartFillIcon : heartIcon}
              alt="heart"
              className="h-6 w-6"
            />
          </button>

          {/* 참가하기(메인) */}
          <button
            type="button"
            onClick={handleJoinToggle}
            disabled={actionDisabled}
            className={`h-12 flex-1 rounded-xl text-[15px] font-semibold transition ${
              actionDisabled
                ? "cursor-not-allowed bg-gray-300 text-background"
                : isJoined
                  ? "bg-primary-light text-background hover:bg-primary"
                  : "bg-primary text-background hover:bg-primary-light"
            }`}
          >
            {joinButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}