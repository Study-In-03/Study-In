import { axiosInstance } from './axios';

export interface PreferredRegion {
  id: number;
  sort_order: number;
  location: string;
}

export interface UserProfile {
  is_associate_member: boolean;
  is_social_user: boolean;
  user_login_type: string;
  user: number;
  name?: string;
  nickname: string;
  profile_img: string;
  introduction: string;
  phone?: string;
  preferred_region: PreferredRegion | null;
  github_username: string;
  tag: Array<{ id: number; name: string }>;
  grade: string;
}

export interface UpdateProfileRequest {
  name?: string;
  nickname?: string;
  profile_img?: string;
  introduction?: string;
  phone?: string;
  github_username?: string;
  tag?: Array<{ id: number; name: string }>;
}

export async function getProfile(userId: number): Promise<UserProfile> {
  const res = await axiosInstance.get<UserProfile>(`/accounts/profiles/${userId}/`);
  return res.data;
}

export async function updateProfile(userId: number, data: UpdateProfileRequest): Promise<UserProfile> {
  const res = await axiosInstance.put<UserProfile>(`/accounts/profiles/${userId}/`, data);
  return res.data;
}

export async function checkNickname(nickname: string): Promise<boolean> {
  try {
    await axiosInstance.get(`/accounts/check-nickname/?nickname=${nickname}`);
    return true;
  } catch {
    return false;
  }
}