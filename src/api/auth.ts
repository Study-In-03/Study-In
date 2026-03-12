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

// 이메일 중복 확인 API
export const checkEmailDuplicate = async (email: string) => {
    const response = await axiosInstance.get(`/accounts/emails/check/`, {
        params: { email }
    });
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
        verification_number,
    });
    return response.data;
};

// 회원가입 API
export const registerApi = async (data: { email: string; password: string }) => {
    const response = await axiosInstance.post('/accounts/register/', data);
    return response.data;
};

// 비밀번호 재설정 - 인증코드 확인 (1단계)
export const verifyPasswordResetCode = async (email: string, code: string) => {
    const response = await axiosInstance.post('/accounts/password-reset/verify/', {
        email,
        code,
    });
    return response.data;
};

// 비밀번호 재설정 - 새 비밀번호 설정 (2단계)
export const confirmPasswordReset = async (email: string, new_password: string) => {
    const response = await axiosInstance.put('/accounts/password-reset/confirm/', {
        email,
        new_password,
    });
    return response.data;
};

// 비밀번호 변경 (로그인 상태) - PUT /accounts/password/
export const changePassword = async (
    email: string,
    current_password: string,
    new_password: string,
) => {
    const response = await axiosInstance.put('/accounts/password/', {
        email,
        current_password,
        new_password,
    });
    return response.data;
};

// 회원 탈퇴 - DELETE /accounts/withdraw/
export const withdrawAccount = async () => {
    const response = await axiosInstance.delete('/accounts/withdraw/');
    return response.data;
};

// 지역 카테고리 조회 - GET /accounts/regions/
export interface Region {
    id: number;
    sort_order: number;
    location: string;
}

export const getRegions = async (): Promise<Region[]> => {
    const response = await axiosInstance.get<Region[]>('/accounts/regions/');
    return response.data;
};

export const sendPasswordResetEmail = async (email: string) => {
    const response = await axiosInstance.post('/accounts/password-reset/', { email });
    return response.data;
};