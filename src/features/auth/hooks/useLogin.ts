import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/auth";
import { getProfile } from "@/api/profile"; 
import { storage } from "@/utils/storage";
import { useAuthStore } from "@/store/authStore";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login: setLogin } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setApiError(null);

    try {
      // 1. 로그인 API 호출
      const data = await loginApi({ email, password });

      // 2. 토큰 및 기본 정보 로컬 스토리지 저장
      storage.setAccessToken(data.access_token);
      storage.setRefreshToken(data.refresh_token);
      storage.setUserId(data.user.pk);
      storage.setEmail(email);

      // 3실제 프로필 정보를 가져와서 닉네임과 정회원 여부 확인 
      // 로그인 응답에는 닉네임이 없으므로 getProfile을 통해 동기화
      const profile = await getProfile(data.user.pk);
      
      // 닉네임, 프로필 이미지 로컬 스토리지 업데이트
      storage.setNickname(profile.nickname);
      if (profile.profile_img) storage.setProfileImg(profile.profile_img);

      // 전역 상태(Zustand) 업데이트 
      // 이전 가이드에서 수정한 authStore의 login(userData, isAssociate) 규격지킴
      setLogin(
        { 
          pk: data.user.pk, 
          email: email, 
          nickname: profile.nickname 
        }, 
        profile.is_associate_member
      );

      // 회원 권한에 따른 페이지 이동
      // 정회원(true) -> 메인 피드("/")
      // 준회원(false) -> 프로필 설정 페이지("/profile/edit")
      if (profile.is_associate_member) {
        navigate("/");
      } else {
        navigate("/profile/create");
      }

    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || 
        error.response?.data?.detail || 
        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.";
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, apiError };
};