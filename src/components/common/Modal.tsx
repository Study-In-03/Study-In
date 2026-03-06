import { useEffect } from 'react';
import { useModalStore } from '@/store/modalStore';

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
  const { isOpen, modalType, confirmType, onConfirm, closeModal, openConfirm } = useModalStore();

  // 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  // 확인 모달
  if (modalType === 'confirm' && confirmType) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* 딤 배경 */}
        <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
        {/* 확인 모달 */}
        <div className="relative z-10 w-[280px] rounded-2xl bg-white p-6 shadow-xl">
          <p className="whitespace-pre-line text-center text-sm text-gray-700 leading-6">
            {CONFIRM_MESSAGES[confirmType]}
          </p>
          <div className="mt-6 flex gap-2">
            <button
              onClick={closeModal}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm text-gray-500 font-medium"
            >
              취소
            </button>
            <button
              onClick={() => { onConfirm?.(); closeModal(); }}
              className={`flex-1 rounded-xl py-2.5 text-sm font-medium text-white ${
                confirmType === 'report' ? 'bg-red-500' : 'bg-primary'
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
          <>
            <button
              onClick={() => {
                closeModal();
                openConfirm('delete', () => {
                  // CommentItem에서 처리
                  useModalStore.getState().onConfirm?.();
                });
              }}
              className="w-full py-4 text-center text-base text-red-500 font-medium border-b border-gray-100"
            >
              삭제
            </button>
          </>
        );
      case 'comment-other':
      case 'study-other':
        return (
          <button
            onClick={() => {
              closeModal();
              openConfirm('report', () => {
                console.log('신고 처리');
              });
            }}
            className="w-full py-4 text-center text-base text-red-500 font-medium border-b border-gray-100"
          >
            신고하기
          </button>
        );
      case 'study-mine':
        return (
          <>
            <button className="w-full py-4 text-center text-base text-gray-700 font-medium border-b border-gray-100">
              수정
            </button>
            <button
              onClick={() => {
                closeModal();
                openConfirm('delete', () => {
                  console.log('스터디 삭제');
                });
              }}
              className="w-full py-4 text-center text-base text-red-500 font-medium border-b border-gray-100"
            >
              삭제
            </button>
          </>
        );
      case 'header':
        return (
          <>
            <button className="w-full py-4 text-center text-base text-gray-700 font-medium border-b border-gray-100">
              설정 및 개인정보
            </button>
            <button
              onClick={() => {
                closeModal();
                openConfirm('logout', () => {
                  console.log('로그아웃');
                });
              }}
              className="w-full py-4 text-center text-base text-red-500 font-medium border-b border-gray-100"
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
      {/* 딤 배경 */}
      <div className="absolute inset-0 bg-black/40" onClick={closeModal} />
      {/* 바텀시트 */}
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl bg-white pb-safe">
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>
        {renderItems()}
        {/* 취소 버튼 */}
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