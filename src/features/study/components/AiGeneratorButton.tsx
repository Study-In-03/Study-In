import { useState } from "react";

interface AiGeneratorButtonProps {
  /** 버튼 라벨 (예: "소개글 AI 생성") */
  label: string;
  /** 해당 필드에 이미 내용이 있으면 덮어쓰기 confirm 모달 표시 */
  targetHasValue: boolean;
  /** 로딩 중 여부 (useAiStream에서 전달) */
  isLoading: boolean;
  /** 실제 생성 트리거 — AI API 연동 시 여기만 교체 */
  onGenerate: () => void;
}

export default function AiGeneratorButton({
  label,
  targetHasValue,
  isLoading,
  onGenerate,
}: AiGeneratorButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  function handleClick() {
    if (isLoading) return;
    if (targetHasValue) {
      // 기존 내용이 있으면 덮어쓰기 confirm 모달 표시
      setShowConfirm(true);
    } else {
      onGenerate();
    }
  }

  function handleConfirm() {
    setShowConfirm(false);
    onGenerate();
  }

  function handleCancel() {
    setShowConfirm(false);
  }

  return (
    <div className="relative inline-flex">
      {/* ── AI 생성 버튼 ── */}
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className="inline-flex items-center gap-[6px] px-3 py-[6px] rounded-lg border border-primary text-primary text-xs font-medium transition-colors hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          /* 로딩 스피너 */
          <>
            <span
              className="w-3.5 h-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin"
              aria-hidden="true"
            />
            생성 중...
          </>
        ) : (
          /* 스파크 아이콘 */
          <>
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" />
            </svg>
            {label}
          </>
        )}
      </button>

      {/* ── 덮어쓰기 confirm 모달 (자리 마련) ── */}
      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI 생성 확인"
          className="absolute bottom-full mb-2 left-0 z-20 w-60 bg-background rounded-xl shadow-lg border border-gray-100 p-4"
        >
          <p className="text-xs text-gray-700 mb-3 leading-relaxed">
            기존 내용을 AI가 생성한 내용으로
            <br />
            <span className="font-bold text-gray-900">덮어쓸까요?</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-[6px] rounded-lg border border-gray-300 text-xs text-gray-600 hover:bg-gray-100 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-[6px] rounded-lg bg-primary text-xs text-background font-medium hover:bg-primary-light transition-colors"
            >
              덮어쓰기
            </button>
          </div>
        </div>
      )}

      {/* confirm 모달 외부 클릭 닫기 */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-10"
          aria-hidden="true"
          onClick={handleCancel}
        />
      )}
    </div>
  );
}
