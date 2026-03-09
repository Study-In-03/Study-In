import { useNavigate } from 'react-router-dom';
import { getMemberType } from '@/api/profile';
import { useModalStore } from '@/store/modalStore';

/**
 * 준회원 차단 훅
 * withAssociateGuard(action) 호출 시:
 *   - 정회원(is_associate_member: true) → action 실행
 *   - 준회원(is_associate_member: false) → 프로필 생성 알럿 노출
 */
export function useAssociateGuard() {
  const { openConfirm } = useModalStore();
  const navigate = useNavigate();

  const withAssociateGuard = async (action: () => void) => {
    try {
      const { is_associate_member } = await getMemberType();
      if (!is_associate_member) {
        openConfirm('associate', () => navigate('/profile/edit'));
        return;
      }
      action();
    } catch {
      action();
    }
  };

  return { withAssociateGuard };
}
