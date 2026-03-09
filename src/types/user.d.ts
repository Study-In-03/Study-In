export interface PreferredRegion {
  id: number;
  sort_order: number;
  location: string;
}

export interface UserProfile {
  is_associate_member: boolean;
  is_social_user: boolean;
  user_login_type: string;
  user: number;           // user pk
  name?: string;          // 내 프로필 조회 시에만 포함
  nickname: string;
  profile_img: string;
  introduction: string;
  phone?: string;         // 내 프로필 조회 시에만 포함
  preferred_region: PreferredRegion | null;
  github_username: string;
  tag: { id: number; name: string }[];
  grade: string;
}

// 채팅/댓글에서 쓰이는 간략한 프로필
export interface SimpleProfile {
  nickname: string;
  profile_img: string | null;
}