import { axiosInstance } from './axios';
import { ChatListResponse } from '@/types/chat';

/**
 * 채팅 내역 조회 (REST API)
 * GET /study/<int:study_pk>/chats/
 */
export const getChatHistory = async (studyPk: number, page: number = 1): Promise<ChatListResponse> => {
    const response = await axiosInstance.get<ChatListResponse>(`/study/${studyPk}/chats/`, {
        params: { page }
    });
    return response.data;
};