import { useState } from "react";
import RegenerationIcon from "@/assets/base/icon-Regeneration.svg?react";
import SparkleIcon from "@/assets/base/icon-sparkle.svg?react";

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
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium transition-colors hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          /* 로딩 스피너 */
          <>
            <span
              className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"
              aria-hidden="true"
            />
            생성 중...
          </>
        ) : targetHasValue ? (
          /* 재생성 아이콘 */
          <>
            <RegenerationIcon className="w-4 h-4" />
            재생성
          </>
        ) : (
          /* 스파크 아이콘 */
          <>
            <SparkleIcon className="w-4 h-4" />
            {label}
          </>
        )}
      </button>

      {/* ── 덮어쓰기 confirm 모달 ── */}
      {showConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="AI 생성 확인"
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-72 bg-background rounded-xl shadow-lg border border-gray-100 p-5 md:absolute md:top-auto md:left-0 md:bottom-full md:mb-2 md:translate-x-0 md:translate-y-0"
        >
          <p className="text-sm text-gray-700 mb-4 leading-relaxed text-center">
            기존 내용을 AI가 생성한 내용으로
            <br />
            <span className="font-bold text-gray-900">덮어쓸까요?</span>
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-2 rounded-lg border border-gray-300 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-2 rounded-lg bg-primary text-sm text-background font-medium hover:bg-primary-light transition-colors"
            >
              덮어쓰기
            </button>
          </div>
        </div>
      )}

      {/* confirm 모달 외부 클릭 닫기 (모바일: 딤 처리) */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-10 bg-black/20 md:bg-transparent"
          aria-hidden="true"
          onClick={handleCancel}
        />
      )}
    </div>
  );
}
