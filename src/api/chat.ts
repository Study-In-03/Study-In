import { axiosInstance } from './axios';
import { ChatListResponse, ImageUploadResponse, FileUploadResponse } from '@/types/chat';

/**
 * 채팅 내역 조회 (REST API)
 * GET /study/<int:study_pk>/chats/
 * 웹소켓 연결 전 기존 채팅 내역을 불러올 때 사용
 */
export const getChatHistory = async (studyPk: number, page: number = 1): Promise<ChatListResponse> => {
  // axiosInstance에서 슬래시(/) 자동 추가 로직이 있으므로 경로만 작성
  const response = await axiosInstance.get<ChatListResponse>(`/study/${studyPk}/chats/`, {
    params: { page }
  });
  return response.data;
};

/**
 * 채팅 이미지 업로드
 * POST /file-uploader/image/
 * 이미지를 서버에 업로드하고 URL을 반환 받음 (5MB 이하)
 */
export const uploadChatImage = async (imageFile: File): Promise<ImageUploadResponse> => {
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await axiosInstance.post<ImageUploadResponse>('/file-uploader/image/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * 채팅 일반 파일 업로드
 * POST /file-uploader/file/
 * 이미지를 제외한 파일을 업로드하고 URL을 반환 받음 (5MB 이하)
 */
export const uploadChatFile = async (file: File): Promise<FileUploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axiosInstance.post<FileUploadResponse>('/file-uploader/file/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};