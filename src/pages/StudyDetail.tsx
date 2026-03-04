import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteStudy } from "@/api/study";
import { storage } from "@/utils/storage";

/**
 * ✅ FIGMA 기반 핵심 수치 (너가 캡처로 준 값)
 * - Frame: 390
 * - Status bar: 390 x 24 (W-Primary #2E6FF2)  -> 프로젝트 bg-primary로 매핑 가정
 * - GNB: 390 x 56 (top 24), 아이콘 터치영역 30x30, 로고 영역 84x22
 * - Content padding: 16
 * - 카드: 358w, radius 12, border 1px (#D9DBE0)
 * - 썸네일: 358 x 358
 * - 해시태그 텍스트: 14 Medium, LH 20, 컬러는 bg-primary-light(#5C8EF2 계열로 보임)
 * - 모집바: 358 x 60, bg primary-light(#5C8EF2)
 * - 일정 카드 내부: padding 20
 * - 요일 pill: 30 x 30 (active: primary-light)
 * - 하단 탭바: 390 x 70
 *   - 공유하기: 110 x 50, radius 8, border 1px #D9DBE0
 *   - 하트: 50 x 50
 *   - 참여하기: 186 x 50, radius 8, bg primary(#2E6FF2)
 */

type StudyDetailData = {
  id: number;
  thumbnailUrl: string;
  title: string;
  leader: { id: number; nickname: string; profileImageUrl: string; grade?: string };
  isOffline: boolean;
  location?: string;
  capacity: number;
  participants: number;
  description: string;
  days: string[];
  startDate: string;
  time: string;
  durationWeeks: number;
  difficulty: "초급" | "중급" | "고급";
  subject: string;
  tags: string[];
  hashtags: string;
  chips: { label: string }[];
  regionLabel: string;
  schedule: {
    statusLabel: string; // 모집 중! (D-10)
    days: string[]; // ["수","금","토"]
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
  isSecret?: boolean;
  isReply?: boolean;
  leaderReply?: boolean;
};

export default function StudyDetail() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  // 좋아요 (필수: UI 토글만)
  const [liked, setLiked] = useState(false);

  // 참가 상태 (오늘은 UI 상태로 시뮬레이션)
  const [isJoined, setIsJoined] = useState(false);

  // 댓글 바텀시트
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

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
      title:
        "크롬 확장 프로그램 함께 구현 해보실 분 찾습니다.\n(맞춤법 검사, 번역 서비스입니다.)",
      hashtags: "#Python #Google #크롬확장프로그램 #구현프로젝트",
      chips: [{ label: "프로젝트" }, { label: "초급" }],
      regionLabel: "노형동",
      schedule: {
        statusLabel: "모집 중! (D-10)",
        days: ["수", "금", "토"],
        startDateLabel: "시작일",
        startDateValue: "2022. 03. 29(화)",
        timeLabel: "시간",
        timeValue: "오후 14시 ~ 16시",
        timeSubValue: "8주/총 24회 48시간",
        capacityLabel: "모집 인원",
        capacityValue: "8/10",
      },
      introTitle: "스터디 소개",
      introBody:
        "이 스터디는 파이썬 문법을 시작하다가 포기한 여러분들을 위하여 만들어진 스터디 입니다.\n얼마나 듣고, 기간과 규칙은 합의해요.\n\n취업용 하는 거 아니고, 같이 하니까 하는 거예요.\n부담 없이 오세요.",
    };
  }, [studyId]);

  const baseComments: CommentItem[] = useMemo(
    () => [
      {
        id: 1,
        author: "주커버그사촌동생",
        date: "2022. 03. 23",
        body: "그룹장님 이거 주말에는 계획 없나요?",
      },
      {
        id: 2,
        author: "파이썬마술사",
        date: "2022. 03. 23",
        body: "네… 주말에는 알바가 있어서… ㅠㅠ",
        isReply: true,
        leaderReply: true,
      },
      { id: 3, author: "익명", date: "2022. 03. 23", body: "비밀댓글입니다.", isSecret: true },
    ],
    []
  );

  const [commentList, setCommentList] = useState<CommentItem[]>(baseComments);

  if (!data) return <div className="px-4 py-6">잘못된 접근입니다.</div>;

  // 참가하기(=isJoined=false)일 때의 비활성 조건
  const joinDisabledReason = !isMember
    ? "정회원만 참가할 수 있어요."
    : isFull
      ? "모집 인원이 마감되었어요."
      : null;

  // 탈퇴하기(=isJoined=true)일 때의 비활성 조건 (스터디장은 탈퇴 불가)
  const leaveDisabledReason = isLeader ? "스터디장은 탈퇴할 수 없어요." : null;

  const actionDisabled = isJoined
    ? Boolean(leaveDisabledReason)
    : Boolean(joinDisabledReason);

  const helperText = isJoined ? leaveDisabledReason : joinDisabledReason;

  const handleJoinToggle = () => {
    if (actionDisabled) return;
    setIsJoined((prev) => !prev);
  };

  const primaryButtonText = isJoined ? "채팅방 가기" : "참여하기";

  const handleOpenComment = () => setIsCommentOpen(true);
  const handleCloseComment = () => {
    setIsCommentOpen(false);
    setCommentText("");
  };

  const handleSubmitComment = () => {
    const text = commentText.trim();
    if (!text) return;

    const today = new Date();
    const yy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    const newComment: CommentItem = {
      id: Date.now(),
      author: "나",
      date: `${yy}. ${mm}. ${dd}`,
      body: text,
    };

    setCommentList((prev) => [newComment, ...prev]);
    setCommentText("");
    setIsCommentOpen(false);
  };

  const DAYS_ALL = ["월", "화", "수", "목", "금", "토", "일"];

  return (
    <div className="w-full bg-[#F7F8FA]">
      {/* ✅ 상단 헤더 포함 (Status bar + GNB) */}
      <div className="mx-auto w-full max-w-[390px]">
        {/* status bar 390x24 */}
        <div className="h-[24px] w-full bg-primary" />

        {/* GNB 390x56 */}
        <header className="flex h-[56px] w-full items-center justify-between border-b border-[#E5E7EB] bg-white px-4">
          {/* menu 30x30 */}
          <button
            type="button"
            aria-label="menu"
            className="flex h-[30px] w-[30px] items-center justify-center"
          >
            <MenuIcon />
          </button>

          {/* logo (84x22) - 피그마는 이미지지만, 경로 깨짐 방지용 텍스트로 고정 */}
          <div className="flex h-[22px] w-[84px] items-center justify-center">
            <span className="text-[18px] font-bold leading-[22px] text-[#121314]">
              Studyin
            </span>
          </div>

          {/* noti 30x30 + dot */}
          <button
            type="button"
            aria-label="notification"
            className="relative flex h-[30px] w-[30px] items-center justify-center"
          >
            <ChatBubbleIcon />
            <span className="absolute right-[3px] top-[3px] h-[6px] w-[6px] rounded-full bg-[#FF3440]" />
          </button>
        </header>
      </div>

      {/* ✅ 본문 */}
      <div className="mx-auto w-full max-w-[390px] px-4 pb-[110px] pt-4">
        {/* ====== TOP 카드(태그/이미지/제목/해시) ====== */}
        <section className="w-[358px] overflow-hidden rounded-[12px] border border-[#D9DBE0] bg-white">
          {/* top tags row */}
          <div className="flex items-center justify-between px-4 pt-4">
            <div className="flex gap-2">
              {data.chips.map((c) => (
                <TagChip key={c.label} label={c.label} />
              ))}
            </div>
            <TagChip label={data.regionLabel} />
          </div>

          {/* image 358x358 */}
          <div className="mt-3">
            <img
              src={data.thumbnailUrl}
              alt="thumbnail"
              className="h-[358px] w-[358px] object-cover"
            />
          </div>

          {/* title + hashtag */}
          <div className="px-4 pb-[14px] pt-4">
            <h1 className="whitespace-pre-line text-[18px] font-bold leading-[26px] text-[#121314]">
              {data.title}
            </h1>
            <p className="mt-2 text-[14px] font-medium leading-[20px] text-primary-light">
              {data.hashtags}
            </p>
          </div>
        </section>

        {/* ====== 모집/일정 카드 ====== */}
        <section className="mt-4 w-[358px] overflow-hidden rounded-[12px] border border-[#D9DBE0] bg-white">
          {/* 모집바 358x60 */}
          <div className="flex h-[60px] items-center bg-primary-light px-4">
            <div className="flex items-center gap-2 text-[14px] font-semibold leading-[18px] text-white">
              <MegaphoneIcon />
              <span>{data.schedule.statusLabel}</span>
            </div>
          </div>

          {/* schedule body padding 20 */}
          <div className="px-5 pb-5 pt-5">
            <h2 className="text-center text-[18px] font-bold leading-[26px] text-[#121314]">
              스터디 일정
            </h2>

            {/* days group (246x30), 각 pill 30x30 */}
            <div className="mx-auto mt-4 flex h-[30px] w-[246px] items-center justify-between">
              {DAYS_ALL.map((d) => {
                const active = data.schedule.days.includes(d);
                return (
                  <div
                    key={d}
                    className={`flex h-[30px] w-[30px] items-center justify-center rounded-full text-[13px] font-semibold leading-[30px] ${
                      active
                        ? "bg-primary-light text-white"
                        : "bg-[#F3F4F6] text-[#6B7280]"
                    }`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 border-t border-[#E5E7EB]" />

            {/* rows */}
            <InfoRow
              left={data.schedule.startDateLabel}
              right={data.schedule.startDateValue}
              leftBlue
              rightBlue
            />
            <div className="border-t border-[#E5E7EB]" />
            <InfoRow
              left={data.schedule.timeLabel}
              right={data.schedule.timeValue}
              subRight={data.schedule.timeSubValue}
            />
            <div className="border-t border-[#E5E7EB]" />
            <InfoRow
              left={data.schedule.capacityLabel}
              right={data.schedule.capacityValue}
              rightBlue
              rightBold
            />
          </div>
        </section>

        {/* ====== 스터디 소개 (피그마처럼 “섹션 타이틀 + 본문”만) ====== */}
        <section className="mt-4 w-[358px] rounded-[12px] border border-[#D9DBE0] bg-white">
          <div className="px-4 pb-3 pt-4">
            <h2 className="text-[18px] font-bold leading-[26px] text-[#121314]">
              {data.introTitle}
            </h2>
          </div>
          <div className="px-4 pb-4">
            <p className="whitespace-pre-line text-[14px] leading-[22px] text-[#2B2B2B]">
              {data.introBody}
            </p>
          </div>
        </section>

        {/* ====== 댓글 영역 (너가 만들었던거 유지하되, 피그마 느낌으로 간단히) ====== */}
        <section className="mt-4 w-[358px] rounded-[12px] border border-[#D9DBE0] bg-white p-4">
          <h2 className="text-[18px] font-bold leading-[26px] text-[#121314]">
            그룹장에게 질문하기
          </h2>

          <button
            type="button"
            onClick={handleOpenComment}
            className="mt-3 h-[40px] w-full rounded-[8px] border border-[#D9DBE0] bg-white text-[14px] font-medium"
          >
            작성하기
          </button>

          <div className="mt-4 space-y-4">
            {commentList.map((c) => (
              <div key={c.id} className={c.isReply ? "pl-6" : ""}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-[#F3F4F6]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[14px] font-bold text-[#121314]">
                          {c.author} {c.leaderReply ? "👑" : null}
                        </p>
                        {!c.isReply ? (
                          <button
                            type="button"
                            className="text-[13px] text-[#9CA3AF]"
                          >
                            답글달기
                          </button>
                        ) : null}
                      </div>
                      <p className="text-[12px] text-[#9CA3AF]">{c.date}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pl-11">
                  <p className="text-[14px] text-[#2B2B2B]">
                    {c.isSecret ? "🔒 " : ""}
                    {c.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {helperText ? (
            <p className="mt-3 text-[13px] text-[#9CA3AF]">{helperText}</p>
          ) : null}
        </section>
      </div>

      {/* ✅ 댓글 작성 바텀시트 */}
      {isCommentOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40">
          <button
            type="button"
            aria-label="닫기"
            className="absolute inset-0"
            onClick={handleCloseComment}
          />
          <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-[390px] rounded-t-2xl bg-white p-4">
            <h3 className="mb-3 text-[15px] font-bold text-[#121314]">
              댓글 작성
            </h3>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="h-24 w-full rounded-xl border border-[#D9DBE0] p-3 text-[13px]"
              placeholder="댓글을 입력하세요"
            />

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                className="h-12 flex-1 rounded-xl border border-[#D9DBE0] text-[13px] font-semibold"
                onClick={handleCloseComment}
              >
                수정하기
              </button>
              <button
                type="button"
                className="h-12 flex-1 rounded-xl bg-primary text-[13px] font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:bg-gray-300"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                삭제하기
              </button>
            </div>
          )}

      {/* ✅ 하단 고정 탭바 (피그마 390x70) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto flex h-[70px] w-full max-w-[390px] items-center gap-2 px-4">
          {isLeader ? (
            <>
              <button
                type="button"
                className="h-[50px] w-[110px] rounded-[8px] border border-[#D9DBE0] bg-white text-[14px] font-medium"
              >
                수정
              </button>

              <button
                type="button"
                className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] border border-[#D9DBE0] bg-white"
                aria-label="공유"
              >
                <ShareIcon />
              </button>

              <button
                type="button"
                onClick={() => setLiked((prev) => !prev)}
                className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] border border-[#D9DBE0] bg-white"
                aria-label="좋아요"
              >
                <img
                  src={liked ? heartFillIcon : heartIcon}
                  alt="heart"
                  className="h-5 w-5"
                />
              </button>

              <button
                type="button"
                className="h-[50px] w-[186px] rounded-[8px] bg-primary text-[14px] font-medium text-white hover:bg-primary-light"
              >
                채팅방 가기
              </button>
            </>
          ) : (
            <>
              {/* 공유하기 110x50 */}
              <button
                type="button"
                className="flex h-[50px] w-[110px] items-center justify-center gap-2 rounded-[8px] border border-[#D9DBE0] bg-white text-[14px] font-medium"
              >
                <ShareIcon />
                공유하기
              </button>

              {/* heart 50x50 */}
              <button
                type="button"
                onClick={() => setLiked((prev) => !prev)}
                className="flex h-[50px] w-[50px] items-center justify-center rounded-[8px] border border-[#D9DBE0] bg-white"
                aria-label="좋아요"
              >
                <img
                  src={liked ? heartFillIcon : heartIcon}
                  alt="heart"
                  className="h-5 w-5"
                />
              </button>

              {/* 참여하기 186x50 */}
              <button
                type="button"
                onClick={() => {
                  if (!isJoined) handleJoinToggle();
                }}
                disabled={!isJoined ? actionDisabled : false}
                className={`h-[50px] w-[186px] rounded-[8px] text-[14px] font-medium transition ${
                  !isJoined && actionDisabled
                    ? "cursor-not-allowed bg-gray-300 text-white"
                    : "bg-primary text-white hover:bg-primary-light"
                }`}
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =======================
   UI Parts
======================= */

function TagChip({ label }: { label: string }) {
  // 피그마 tag-M: height 32, radius 36, border 1, padding top/bot 6, left/right 14
  return (
    <div className="flex h-[32px] items-center justify-center rounded-full border border-[#D9DBE0] bg-[#F3F5FA] px-[14px] text-[14px] leading-[20px] text-[#2B2B2B]">
      {label}
    </div>
  );
}

function InfoRow({
  left,
  right,
  subRight,
  leftBlue,
  rightBlue,
  rightBold,
}: {
  left: string;
  right: string;
  subRight?: string;
  leftBlue?: boolean;
  rightBlue?: boolean;
  rightBold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between py-3">
      <div
        className={`text-[14px] font-semibold leading-[20px] ${
          leftBlue ? "text-primary-light" : "text-[#2B2B2B]"
        }`}
      >
        {left}
      </div>

      <div className="text-right">
        <div
          className={`text-[14px] leading-[20px] ${
            rightBold ? "font-bold" : "font-normal"
          } ${rightBlue ? "text-primary-light" : "text-[#2B2B2B]"}`}
        >
          {right}
        </div>
        {subRight ? (
          <div className="mt-[2px] text-[12px] leading-[16px] text-[#9CA3AF]">
            {subRight}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* =======================
   Inline SVG Icons (경로 문제로 빌드 깨지는 것 방지)
======================= */

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="#121314"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChatBubbleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 14c0 1.1-.9 2-2 2H9l-4 3v-3H6c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h12c1.1 0 2 .9 2 2v8z"
        fill="none"
        stroke="#121314"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M15 8a3 3 0 1 0-2.83-4H12a3 3 0 0 0 3 4ZM6 14a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-1a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
        fill="none"
        stroke="#121314"
        strokeWidth="1.8"
      />
      <path
        d="M8.6 15.2 15.4 13M15.3 9.6 8.7 13.3"
        fill="none"
        stroke="#121314"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MegaphoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M3 11v2a2 2 0 0 0 2 2h2l7 4V5l-7 4H5a2 2 0 0 0-2 2Z"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16 9a4 4 0 0 1 0 6"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}