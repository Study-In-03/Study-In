import { create } from 'zustand';

export type ModalType =
  | 'comment-mine'      // 내 댓글: 삭제
  | 'comment-other'     // 타인 댓글: 신고
  | 'study-mine'        // 내 스터디: 수정/삭제
  | 'study-other'       // 타인 스터디: 신고
  | 'header'            // 헤더: 설정/로그아웃
  | 'confirm';          // 확인 모달 (로그아웃/삭제/신고)

export type ConfirmType = 'logout' | 'delete' | 'report';

interface ModalState {
  isOpen: boolean;
  modalType: ModalType | null;
  confirmType: ConfirmType | null;
  // 댓글 모달에서 선택된 ID
  targetId: number | null;
  parentId: number | null; // 대댓글인 경우 부모 댓글 ID
  // 확인 모달 콜백
  onConfirm: (() => void) | null;

  // 바텀시트 열기
  openModal: (type: ModalType, targetId?: number, parentId?: number) => void;
  // 확인 모달 열기
  openConfirm: (type: ConfirmType, onConfirm: () => void) => void;
  // 닫기
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  confirmType: null,
  targetId: null,
  parentId: null,
  onConfirm: null,

  openModal: (type, targetId, parentId) =>
    set({ isOpen: true, modalType: type, confirmType: null, targetId: targetId ?? null, parentId: parentId ?? null, onConfirm: null }),

  openConfirm: (type, onConfirm) =>
    set({ isOpen: true, modalType: 'confirm', confirmType: type, onConfirm }),

  closeModal: () =>
    set({ isOpen: false, modalType: null, confirmType: null, targetId: null, parentId: null, onConfirm: null }),
}));