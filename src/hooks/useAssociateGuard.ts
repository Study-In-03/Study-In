import { useNavigate } from 'react-router-dom';
import { getMemberType } from '@/api/profile';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';

/**
 * 준회원 차단 훅
 * withAssociateGuard(action) 호출 시:
 *   - 정회원(is_associate_member: true) → action 실행
 *   - 준회원(is_associate_member: false) → 프로필 생성 알럿 노출
 */
export function useAssociateGuard() {
  const { openConfirm } = useModalStore();
  const { isAssociateMember } = useAuthStore(); // 스토어 값 가져오기
  const navigate = useNavigate();

  const withAssociateGuard = async (action: () => void) => {
    // 스토어에 이미 정회원 정보가 있다면 즉시 실행
    if (isAssociateMember) {
      action();
      return;
    }

    try {
      // 스토어에 없다면 최신 상태 확인 (보안 강화)
      const { is_associate_member } = await getMemberType();
      if (!is_associate_member) {
        openConfirm('associate', () => navigate('/profile/edit'));
        return;
      }
      action();
    } catch {
      console.error('회원 유형 확인 실패'); // API 실패 시 통과 불가
    }
  };

  return { withAssociateGuard };
}