import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { deleteStudy } from "@/api/study";
import { storage } from "@/utils/storage";

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
};

export default function StudyDetail() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();

  // 좋아요 (필수: UI 토글만)
  const [liked, setLiked] = useState(false);

  // 참가 상태 (오늘은 UI 상태로 시뮬레이션)
  const [isJoined, setIsJoined] = useState(false);

  // 삭제 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMember = true; // 정회원 여부
  // 모집 인원 초과 여부 (참가 불가)
  const isFull = false;

  const data: StudyDetailData | null = useMemo(() => {
    if (!studyId) return null;

    return {
      id: Number(studyId),
      thumbnailUrl:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60",
      title: "React 스터디 (주 2회) - 프로젝트 같이 해요",
      leader: {
        id: 0,
        nickname: "StudyLeader",
        profileImageUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=60",
        grade: "정회원",
      },
      isOffline: true,
      location: "제주 제주시 (오프라인)",
      capacity: 10,
      participants: 6,
      description:
        "주 2회 같이 모여서 React 프로젝트를 진행합니다. 초급~중급 환영! 일정과 규칙은 스터디 내에서 합의해요.",
      days: ["화", "목"],
      startDate: "2026-03-03",
      time: "19:00 ~ 21:00",
      durationWeeks: 6,
      difficulty: "중급",
      subject: "프로젝트",
      tags: ["React", "TypeScript", "Vite", "협업"],
    };
  }, [studyId]);

  if (!data) return <div className="p-6">잘못된 접근입니다.</div>;

  const isLeader = storage.getUserId() === data.leader.id;

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteStudy(data.id);
      navigate("/");
    } catch {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // 버튼 상태 / 문구 / 비활성 사유 계산
  const joinButtonText = isJoined ? "탈퇴하기" : "참가하기";

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

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-6">
      {/* 상단 */}
      <section className="mb-6">
        <p className="mb-2 text-xs text-gray-500">studyId: {studyId}</p>
        <h1 className="text-2xl font-bold">{data.title}</h1>

        <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-700">
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {data.subject}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {data.difficulty}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1">
            {data.isOffline ? "오프라인" : "온라인"}
          </span>
        </div>
      </section>

      {/* 썸네일 + 기본정보 */}
      <section className="grid gap-6 md:grid-cols-[360px_1fr]">
        <div className="overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={data.thumbnailUrl}
            alt="thumbnail"
            className="h-56 w-full object-cover md:h-72"
          />
        </div>

        <div className="rounded-2xl border p-4 md:p-6">
          <div className="flex items-center gap-3">
            <img
              src={data.leader.profileImageUrl}
              alt="profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            <p className="text-sm font-bold">
              {data.leader.nickname}{" "}
              {data.leader.grade ? (
                <span className="text-xs text-gray-500">
                  ({data.leader.grade})
                </span>
              ) : null}
            </p>
          </div>

          <div className="mt-5 grid gap-2 text-sm">
            <p>
              <span className="text-gray-500">모집 인원:</span>{" "}
              {data.participants}/{data.capacity}
            </p>
            <p>
              <span className="text-gray-500">진행 요일:</span>{" "}
              {data.days.join(", ")}
            </p>
            <p>
              <span className="text-gray-500">시작일:</span> {data.startDate}
            </p>
            <p>
              <span className="text-gray-500">시간:</span> {data.time}
            </p>
            <p>
              <span className="text-gray-500">기간:</span> {data.durationWeeks}주
            </p>
            {data.isOffline && (
              <p>
                <span className="text-gray-500">장소:</span>{" "}
                {data.location ?? "-"}
              </p>
            )}
          </div>

          {/* 스터디장 전용: 수정/삭제 버튼 */}
          {isLeader && (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => navigate(`/study/${studyId}/edit`)}
                className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
              >
                수정하기
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="rounded-xl border border-error-border px-4 py-2 text-sm font-medium text-error transition hover:bg-error-light"
              >
                삭제하기
              </button>
            </div>
          )}

          {/* 버튼 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {/* 참가/탈퇴 버튼: 조건 UI 적용 */}
            <button
              type="button"
              onClick={handleJoinToggle}
              disabled={actionDisabled}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                actionDisabled
                  ? "cursor-not-allowed bg-gray-100 text-gray-500"
                  : isJoined
                    ? "bg-gray-300 text-black"
                    : "bg-black text-background"
              }`}
            >
              {joinButtonText}
            </button>

            {/* 좋아요(필수: UI 토글만) */}
            <button
              type="button"
              onClick={() => setLiked((prev) => !prev)}
              aria-pressed={liked}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                liked
                  ? "bg-error text-background"
                  : "border border-gray-300 bg-background text-black"
              }`}
            >
              {liked ? "♥ 좋아요" : "♡ 좋아요"}
            </button>
          </div>

          {/* 조건 안내 텍스트 */}
          {helperText ? (
            <p className="mt-2 text-xs text-gray-500">{helperText}</p>
          ) : null}
        </div>
      </section>

      {/* 소개 */}
      <section className="mt-8 rounded-2xl border p-4 md:p-6">
        <h2 className="text-lg font-bold">스터디 소개</h2>
        <p className="mt-3 text-sm text-gray-700">{data.description}</p>
      </section>

      {/* 태그 */}
      <section className="mt-6 rounded-2xl border p-4 md:p-6">
        <h2 className="text-lg font-bold">태그</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* 댓글 자리(구조 정리 완료: 나중에 컴포넌트 꽂기) */}
      <section className="mt-6 rounded-2xl border p-4 md:p-6">
        <h2 className="text-lg font-bold">댓글</h2>
        <div className="mt-3 rounded-xl bg-gray-100 p-3 text-sm text-gray-500">
          (댓글 컴포넌트가 이 위치에 추가될 예정입니다.)
        </div>
      </section>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-background p-6 shadow-xl">
            <h2 className="text-lg font-bold">스터디 삭제</h2>
            <p className="mt-2 text-sm text-gray-700">
              정말 이 스터디를 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-gray-300 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-error py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
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