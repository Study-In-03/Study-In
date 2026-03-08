import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/auth";
import { getMemberType } from "@/api/profile";
import { storage } from "@/utils/storage";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setApiError(null); // 에러 초기화

    try {
      // API 호출
      const data = await loginApi({ email, password });

      // 스토리지에 토큰 및 사용자 ID 저장
      storage.setAccessToken(data.access_token);
      storage.setRefreshToken(data.refresh_token);
      storage.setUserId(data.user.pk);
      storage.setEmail(email);
      setLogin();

      // 준회원이면 프로필 생성 페이지로, 정회원이면 메인으로
      try {
        const { is_associate_member } = await getMemberType();
        navigate(is_associate_member ? "/" : "/profile/edit");
      } catch {
        navigate("/");
      }
    } catch (error: any) {
      // 실패 시 에러 핸들링
      const errorMessage =
        error.response?.data?.error ||
        "로그인에 실패했습니다. 다시 시도해주세요.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, apiError };
};
