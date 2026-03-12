import { axiosInstance } from './axios';
import type { UserProfile, PreferredRegion } from '@/types/user';

export type { UserProfile, PreferredRegion };

export interface UpdateProfileRequest {
  name?: string;
  nickname?: string;
  profile_img?: string;
  introduction?: string;
  phone?: string;
  preferred_region?: { id: number };
  github_username?: string;
  tag?: Array<{ id?: number; name: string }>;  
}

export async function getProfile(userId: number): Promise<UserProfile> {
  const res = await axiosInstance.get<UserProfile>(`/accounts/profiles/${userId}/`);
  return res.data;
}

export async function updateProfile(userId: number, data: UpdateProfileRequest): Promise<UserProfile> {
  const res = await axiosInstance.put<UserProfile>(`/accounts/profiles/${userId}/`, data);
  return res.data;
}

/* 회원 유형 확인. is_associate_member: true → 정회원, false → 준회원 */
export async function getMemberType(): Promise<{ is_associate_member: boolean }> {
  const res = await axiosInstance.get<{ is_associate_member: boolean }>('/accounts/members/type/');
  return res.data;
}

export async function checkNickname(nickname: string): Promise<{ available: boolean; message: string }> {
  try {
    const res = await axiosInstance.get(`/accounts/nicknames/`, { params: { nickname } })
    return { available: true, message: res.data.data }
  } catch (error: any) {
    const message = error.response?.data?.error ?? '닉네임 확인에 실패했어요.'
    return { available: false, message }
  }
}