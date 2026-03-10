import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModalStore } from "@/store/modalStore";
import { useAuthStore } from "@/store/authStore";
import { storage } from "@/utils/storage";
import ReportModal from "@/components/common/ReportModal";
import UserInfoModal from "@/components/common/UserInfoModal";

const CONFIRM_LABELS: Record<string, string> = {
  logout: '로그아웃',
  delete: '삭제',
  report: '신고',
};

const CONFIRM_MESSAGES: Record<string, string> = {
  logout: '정말 로그아웃 하시겠어요?',
  delete: '정말 삭제하시겠어요?\n삭제된 댓글은 복구할 수 없습니다.',
  report: '이 댓글을 신고하시겠어요?',
};

const Modal = () => {
  const {
    isOpen,
    modalType,
    confirmType,
    onConfirm,
    onEdit,
    closeModal,
    openConfirm,
    targetId,
    reportTargetType,
  } = useModalStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen && !isReportModalOpen) return null;

  // 신고 모달 (바텀시트 → 신고하기 클릭 후)
  if (isReportModalOpen && targetId !== null && reportTargetType !== null) {
    return (
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        targetType={reportTargetType}
        targetId={targetId}
      />
    );
  }

  // 신고 모달 (바로 열기)
  if (modalType === "report" && isOpen && targetId !== null && reportTargetType !== null) {
    return (
      <ReportModal
        isOpen={true}
        onClose={closeModal}
        targetType={reportTargetType}
        targetId={targetId}
      />
    );
  }

  // 유저 정보 모달
  if (modalType === "user-info" && isOpen && targetId !== null) {
    return <UserInfoModal userId={targetId} onClose={closeModal} />;
  }

  // 준회원 알럿 모달
  if (modalType === "confirm" && confirmType === "associate") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        <div className="relative z-10 w-[400px] rounded-[10px] bg-background shadow-[0px_5px_15px_rgba(71,73,77,0.10)] border border-gray-300 overflow-hidden">
          <p className="whitespace-pre-line text-center text-lg text-black leading-6 py-9 px-6">
            준회원은 참여할 수 없어요.{"\n"}프로필 생성을 완료해 주세요.
          </p>
          <div className="flex border-t border-gray-300">
            <button
              onClick={() => { onConfirm?.(); closeModal(); }}
              className="flex-1 h-[50px] bg-primary text-background text-lg font-medium border-r border-gray-300"
            >
              프로필 생성하기
            </button>
            <button
              onClick={closeModal}
              className="flex-1 h-[50px] bg-background text-gray-700 text-lg font-medium"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 확인 모달 (로그아웃 / 삭제 / 신고)
  if (modalType === "confirm" && confirmType) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        <div className="relative z-10 w-[280px] rounded-2xl bg-background p-6 shadow-xl">
          <p className="whitespace-pre-line text-center text-sm text-gray-700 leading-6">
            {CONFIRM_MESSAGES[confirmType]}
          </p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={closeModal}
              className="flex-1 rounded-xl border border-gray-300 py-2.5 text-sm text-gray-500 font-medium"
            >
              취소
            </button>
            <button
              onClick={() => { onConfirm?.(); closeModal(); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-background ${
                confirmType === 'report' ? 'bg-error' : 'bg-primary'
              }`}
            >
              {CONFIRM_LABELS[confirmType]}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 바텀시트 모달
  const renderItems = () => {
    switch (modalType) {
      case 'comment-mine':
        return (
          <button
            onClick={() => {
              closeModal();
              openConfirm('delete', () => {
                useModalStore.getState().onConfirm?.();
              });
            }}
            className="w-full py-4 text-center text-base text-error font-medium border-b border-gray-100"
          >
            삭제
          </button>
        );
      case 'comment-other':
      case 'study-other':
        return (
          <button
            onClick={() => {
              closeModal();
              setIsReportModalOpen(true);
            }}
            className="w-full py-4 text-center text-base text-error font-medium border-b border-gray-100"
          >
            신고하기
          </button>
        );
      case 'study-mine':
        return (
          <>
            {/* 수정: onEdit 콜백 연결 */}
            <button
              onClick={() => {
                closeModal();
                onEdit?.();
              }}
              className="w-full py-4 text-center text-base text-gray-700 font-medium border-b border-gray-100"
            >
              수정
            </button>
            {/* 삭제: onConfirm 콜백 연결 */}
            <button
              onClick={() => {
                const deleteCallback = onConfirm;
                closeModal();
                openConfirm("delete", () => deleteCallback?.());
              }}
              className="w-full py-4 text-center text-base text-error font-medium border-b border-gray-100"
            >
              삭제
            </button>
          </>
        );
      case 'header':
        return (
          <>
            {/* 설정 및 개인정보: 프로필 편집으로 이동 */}
            <button
              onClick={() => {
                closeModal();
                navigate("/profile/edit");
              }}
              className="w-full py-4 text-center text-base text-gray-700 font-medium border-b border-gray-100"
            >
              설정 및 개인정보
            </button>
            {/* 로그아웃: 실제 logout + storage 정리 연동 */}
            <button
              onClick={() => {
                closeModal();
                openConfirm("logout", () => {
                  logout();
                  storage.clearAuth();
                  navigate("/");
                });
              }}
              className="w-full py-4 text-center text-base text-error font-medium border-b border-gray-100"
            >
              로그아웃
            </button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl bg-background pb-safe">
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        {renderItems()}
        <button
          onClick={closeModal}
          className="w-full py-4 text-center text-base text-gray-500 font-medium"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default Modal;