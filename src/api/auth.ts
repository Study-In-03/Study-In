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

// 이메일 중복 확인 API
export const checkEmailDuplicate = async (email: string) => {
    const response = await axiosInstance.get(`/accounts/emails/check/?email=${email}`);
    return response.data;
};

// 회원가입 용 이메일 발송 API
export const sendRegisterEmail = async (email: string) => {
    const response = await axiosInstance.post('/accounts/email-verifications/', { email });
    return response.data;
};

// 회원가입 인증 코드 체크 API
export const verifyRegisterCode = async (email: string, verification_number: string) => {
    const response = await axiosInstance.post('/accounts/email-verifications/verify/', {
        email,
        verification_number 
    });
    return response.data;
};