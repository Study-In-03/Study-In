import { axiosInstance } from './axios';

// 백엔드로 보낼 데이터 타입
export interface LoginRequest {
    email: string;
    password: string;
}

// 백엔드에서 받을 데이터 타입
export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    user: {
        pk: number;
        email: string;
        uid: string;
    };
}
export const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/accounts/login/', data);
    return response.data;
};

// 비밀번호 찾기 이메일 발송 API
export const sendPasswordResetEmail = async (email: string) => {
    const response = await axiosInstance.post('/accounts/password-reset/', { email });
    return response.data;
};

// 비밀번호 재설정 API (이메일, 새 비밀번호 전달)
export const resetPasswordConfirm = async (email: string, new_password: string) => {
    // PUT 메서드로 요청
    const response = await axiosInstance.put('/accounts/password-reset/confirm/', {
        email,
        new_password
    });
    return response.data;
};