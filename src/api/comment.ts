import { axiosInstance } from './axios';

// 댓글 타입
export interface Comment {
  id: number;
  is_secret: boolean;
  user: {
    user_id: number;
    nickname: string;
    profile_img: string;
    is_author: boolean;
  };
  study: number;
  content: string;
  created: string;
  updated: string;
}

// 댓글 작성 요청 타입
export interface CreateCommentRequest {
  content: string;
  is_secret?: boolean;
}

// 댓글 수정 요청 타입
export interface UpdateCommentRequest {
  content: string;
  is_secret?: boolean;
}

// 댓글 전체 조회
export const getComments = async (studyPk: number): Promise<Comment[]> => {
  const response = await axiosInstance.get(`/study/${studyPk}/comment/`);
  return response.data;
};

// 댓글 작성
export const createComment = async (
  studyPk: number,
  data: CreateCommentRequest
): Promise<Comment> => {
  const response = await axiosInstance.post(`/study/${studyPk}/comment/`, data);
  return response.data;
};

// 댓글 수정
export const updateComment = async (
  studyPk: number,
  commentPk: number,
  data: UpdateCommentRequest
): Promise<Comment> => {
  const response = await axiosInstance.put(
    `/study/${studyPk}/comment/${commentPk}/`,
    data
  );
  return response.data;
};

// 댓글 삭제
export const deleteComment = async (
  studyPk: number,
  commentPk: number
): Promise<void> => {
  await axiosInstance.delete(`/study/${studyPk}/comment/${commentPk}/`);
};