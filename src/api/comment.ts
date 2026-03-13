import { axiosInstance } from "./axios";

// 일반 유저 (is_author 있음)
export interface CommentUserNormal {
  id: number;
  profile: {
    nickname: string;
    profile_img: string | null;
  };
  is_author: boolean;
}

// 비밀/삭제 댓글 유저 (익명)
export interface CommentUserAnon {
  profile: {
    nickname: string;
  };
}

// 탈퇴한 유저
export type CommentUserWithdrawn = "탈퇴한 회원입니다.";

export type CommentUser = CommentUserNormal | CommentUserAnon | CommentUserWithdrawn;

// CommentUser 타입 가드
export const isNormalUser = (user: CommentUser | undefined): user is CommentUserNormal => {
  // user가 없거나(undefined, null) 문자열이면 false 반환
  if (!user || typeof user === "string") return false;
  return "id" in user;
};

// 탈퇴 유저 타입 가드
export const isWithdrawnUser = (user: CommentUser | undefined): user is CommentUserWithdrawn => {
  if (!user) return false;
  return typeof user === "string";
};

export interface Recomment {
  id: number;
  recomment_id: number;
  is_secret: boolean;
  study_id: number;
  comment_id: number;
  user: CommentUser;
  content: string;
  tagged_user: { user_id: number; nickname: string } | null;
  tagged_comment?: null; // 비밀 대댓글일 때
  created: string;
  updated: string;
}

export interface Comment {
  id: number;
  is_secret?: boolean; // 삭제된 댓글엔 없음
  is_delete?: boolean; // 삭제된 댓글일 경우 true
  user?: CommentUser; // 삭제된 댓글엔 없음
  study: number;
  content: string;
  created?: string; // 삭제된 댓글엔 없음
  updated?: string; // 삭제된 댓글엔 없음
  recomments: Recomment[];
}

export interface CreateCommentRequest {
  content: string;
  is_secret?: boolean;
}

export interface CreateRecommentRequest {
  content: string;
  is_secret?: boolean;
  tagged_user?: number; // 태그한 유저의 id (대댓글에서 답글 달기 시에만 사용)
}

export const getComments = async (studyPk: number): Promise<Comment[]> => {
  const response = await axiosInstance.get(`/study/${studyPk}/comment/`);
  return response.data;
};

export const createComment = async (
  studyPk: number,
  data: CreateCommentRequest,
): Promise<Comment> => {
  const response = await axiosInstance.post(`/study/${studyPk}/comment/`, data);
  return response.data;
};

export const updateComment = async (
  studyPk: number,
  commentPk: number,
  data: CreateCommentRequest,
): Promise<Comment> => {
  const response = await axiosInstance.put(
    `/study/${studyPk}/comment/${commentPk}/`,
    data,
  );
  return response.data;
};

export const deleteComment = async (
  studyPk: number,
  commentPk: number,
): Promise<{ detail: string }> => {
  const response = await axiosInstance.delete(
    `/study/${studyPk}/comment/${commentPk}/`,
  );
  return response.data;
};

export const createRecomment = async (
  studyPk: number,
  commentPk: number,
  data: CreateRecommentRequest,
): Promise<Recomment> => {
  const payload: Record<string, unknown> = {
    content: data.content,
    is_secret: data.is_secret ?? false,
  };

  if (data.tagged_user !== undefined && data.tagged_user !== null) {
    payload.tagged_user = data.tagged_user;
  }

  const response = await axiosInstance.post(
    `/study/${studyPk}/comment/${commentPk}/recomment/`,
    payload,
  );

  return response.data;
};

export const updateRecomment = async (
  studyPk: number,
  commentPk: number,
  recommentPk: number,
  data: Pick<CreateRecommentRequest, "content" | "is_secret">, // tagged_user는 수정 불가
): Promise<Recomment> => {
  const response = await axiosInstance.put(
    `/study/${studyPk}/comment/${commentPk}/recomment/${recommentPk}/`,
    data,
  );
  return response.data;
};

export const deleteRecomment = async (
  studyPk: number,
  commentPk: number,
  recommentPk: number,
): Promise<{ detail: string }> => {
  const response = await axiosInstance.delete(
    `/study/${studyPk}/comment/${commentPk}/recomment/${recommentPk}/`,
  );
  return response.data;
};
