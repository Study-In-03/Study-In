import { useNavigate } from 'react-router-dom';
import { getMemberType } from '@/api/profile';
import { useModalStore, type ConfirmType } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';

/**
 * 준회원 차단 훅
 * withAssociateGuard(action, type?) 호출 시:
 *   - 정회원(is_associate_member: true) → action 실행
 *   - 준회원(is_associate_member: false) → 프로필 생성 알럿 노출
 */
export function useAssociateGuard() {
  const { openConfirm } = useModalStore();
  const { isAssociateMember } = useAuthStore();
  const navigate = useNavigate();

  const withAssociateGuard = async (action: () => void, type: ConfirmType = 'associate') => {
    if (isAssociateMember) {
      action();
      return;
    }

    try {
      const { is_associate_member } = await getMemberType();
      if (!is_associate_member) {
        openConfirm(type, () => navigate('/profile/edit'));
        return;
      }
      action();
    } catch {
      console.error('회원 유형 확인 실패');
    }
  };

  return { withAssociateGuard };
}