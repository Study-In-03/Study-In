import { create } from 'zustand';
import { ReportTargetType } from '@/api/report';

export type ModalType =
  | 'comment-mine'      // 내 댓글: 수정/삭제
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
  targetId: number | null;
  parentId: number | null;
  reportTargetType: ReportTargetType | null;
  onConfirm: (() => void) | null;
  onEdit: (() => void) | null;
  openModal: (type: ModalType, targetId?: number, parentId?: number, reportTargetType?: ReportTargetType, onEdit?: () => void, onConfirm?: () => void) => void;
  openConfirm: (type: ConfirmType, onConfirm: () => void) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  confirmType: null,
  targetId: null,
  parentId: null,
  reportTargetType: null,
  onConfirm: null,
  onEdit: null,
  openModal: (type, targetId, parentId, reportTargetType, onEdit, onConfirm) =>
    set({
      isOpen: true,
      modalType: type,
      confirmType: null,
      targetId: targetId ?? null,
      parentId: parentId ?? null,
      reportTargetType: reportTargetType ?? null,
      onConfirm: onConfirm ?? null,
      onEdit: onEdit ?? null,
    }),
  openConfirm: (type, onConfirm) =>
    set({ isOpen: true, modalType: 'confirm', confirmType: type, onConfirm }),
  closeModal: () =>
    set({
      isOpen: false,
      modalType: null,
      confirmType: null,
      targetId: null,
      parentId: null,
      reportTargetType: null,
      onConfirm: null,
      onEdit: null,
    }),
}));
