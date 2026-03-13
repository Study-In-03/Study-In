import { useEffect } from "react";
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
  associate: '설정하러 가기',
};

const CONFIRM_MESSAGES: Record<string, string> = {
  logout: '정말 로그아웃 하시겠어요?',
  delete: '정말 삭제하시겠어요?\n삭제된 댓글은 복구할 수 없습니다.',
  report: '이 댓글을 신고하시겠어요?',
  associate: '정회원 전용 서비스입니다.\n프로필 설정을 완료하시겠어요?',
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
    openModal,
    targetId,
    reportTargetType,
  } = useModalStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // 신고 모달
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
  if (modalType === "confirm" && (confirmType === "associate" || confirmType === "associate-join")) {
    const message = confirmType === "associate-join"
      ? "준회원은 참여할 수 없어요.\n프로필 생성을 완료해주세요."
      : "준회원은 댓글을 작성할 수 없어요.\n프로필 생성을 완료해 주세요.";
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        <div className="relative z-10 w-full max-w-[320px] rounded-[10px] bg-background shadow-[0px_5px_15px_rgba(71,73,77,0.10)] border border-gray-300 overflow-hidden">
          <p className="whitespace-pre-line text-center text-sm text-black leading-6 py-7 px-5">
            {message}
          </p>
          <div className="flex border-t border-gray-300">
            <button
              onClick={() => { onConfirm?.(); closeModal(); }}
              className="flex-1 h-11 bg-primary text-background text-sm font-medium border-r border-gray-300"
            >
              프로필 생성하기
            </button>
            <button
              onClick={closeModal}
              className="flex-1 h-11 bg-background text-gray-700 text-sm font-medium"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 스터디 삭제 확인 모달
  if (modalType === "confirm" && confirmType === "study-delete") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        <div className="relative z-10 w-full max-w-[400px] rounded-[10px] bg-background shadow-[0px_5px_15px_rgba(71,73,77,0.10)] outline outline-1 outline-gray-300 overflow-hidden">
          <p className="text-center text-sm sm:text-base text-black py-7 sm:py-[36px] px-6">
            스터디를 삭제하시겠습니까?
          </p>
          <div className="flex border-t border-gray-300">
            <button
              onClick={() => { onConfirm?.(); closeModal(); }}
              className="flex-1 h-11 sm:h-[50px] bg-background text-gray-700 text-sm sm:text-base font-medium border-r border-gray-300 hover:bg-gray-50 transition-colors"
            >
              삭제하기
            </button>
            <button
              onClick={closeModal}
              className="flex-1 h-11 sm:h-[50px] bg-background text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 스터디 생성 확인 모달
  if (modalType === "confirm" && confirmType === "study-create") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        <div className="relative z-10 w-full max-w-[400px] rounded-[10px] bg-background shadow-[0px_5px_15px_rgba(71,73,77,0.10)] outline outline-1 outline-gray-300 overflow-hidden">
          <p className="text-center text-sm sm:text-base text-black py-7 sm:py-[36px] px-6">
            스터디를 생성하시겠습니까?
          </p>
          <div className="flex border-t border-gray-300">
            <button
              onClick={() => { onConfirm?.(); closeModal(); }}
              className="flex-1 h-11 sm:h-[50px] bg-background text-gray-700 text-sm sm:text-base font-medium border-r border-gray-300 hover:bg-gray-50 transition-colors"
            >
              생성하기
            </button>
            <button
              onClick={closeModal}
              className="flex-1 h-11 sm:h-[50px] bg-background text-gray-700 text-sm sm:text-base font-medium hover:bg-gray-50 transition-colors"
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
      case 'study-mine':
        return (
          <>
            <button
              onClick={() => { closeModal(); onEdit?.(); }}
              className="w-full py-4 text-center text-base text-gray-700 font-medium border-b border-gray-100"
            >
              수정
            </button>
            <button
              onClick={() => {
                const deleteCallback = onConfirm;
                closeModal();
                openConfirm('delete', () => deleteCallback?.());
              }}
              className="w-full py-4 text-center text-base text-error font-medium border-b border-gray-100"
            >
              삭제
            </button>
          </>
        );
      case 'comment-other':
      case 'study-other':
        return (
          <button
            onClick={() => openModal('report', targetId ?? undefined, undefined, reportTargetType ?? undefined)}
            className="w-full py-4 text-center text-base text-error font-medium border-b border-gray-100"
          >
            신고
          </button>
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