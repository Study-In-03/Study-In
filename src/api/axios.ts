import axios from 'axios';
import { storage } from '@/utils/storage';

// 기본 설정이 적용된 Axios 인스턴스 생성
export const axiosInstance = axios.create({
    // .env 파일에 VITE_API_BASE_URL이 있으면 그걸 쓰고, 없으면 임시로 localhost:8080 사용
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    // 5초 동안 서버 응답이 없으면 에러 처리
    timeout: 5000, 
    // 서버로 보내는 데이터는 모두 JSON 형태
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor (요청 보내기 전)
axiosInstance.interceptors.request.use(
    (config) => {
        // 토큰을 헤더에 넣지 말아야 할 API 엔드포인트 목록
        // (로그인, 회원가입, 토큰 갱신 등은 Access Token이 필요 없음)
        const noAuthUrls = [
            '/accounts/login/',
            '/accounts/token/refresh/',
            // 나중에 '/accounts/register/', '/accounts/password-reset/' 등 추가 예정
        ];

        // 현재 요청하려는 URL이 위 목록에 포함되어 있는지 확인
        const isNoAuthUrl = noAuthUrls.some((url) => config.url?.includes(url));

        // 예외 목록에 없는 일반 API 요청일 때만 토큰 꽂아줌
        if (!isNoAuthUrl) {
            const token = storage.getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor (응답 받은 후 & 에러 처리)
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            // 로그아웃 상태에서도 허용할 API인지 확인
            const skipRedirectUrls = ['/accounts/login/', '/studies/']; 
            const isSkipUrl = skipRedirectUrls.some((url) => originalRequest.url?.includes(url));

            if (isSkipUrl) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            const refreshToken = storage.getRefreshToken();

            // Refresh 토큰이 없는 경우
            if (!refreshToken) {
                storage.clearAuth();

                // 메인 페이지나 상세 페이지 등 로그인이 필수가 아닌 곳에서는 튕기지 않음
                const currentPath = window.location.pathname;
                const isPublicPage = 
                    currentPath === '/' || 
                    currentPath.startsWith('/study/'); 
                
                // 스터디 생성 페이지는 로그인이 필요하므로 제외
                const isCreatePage = currentPath === '/study/create';

                if (!isPublicPage || isCreatePage) {
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }

            // 토큰 갱신 로직 시작 (기존 로직 유지)
            try {
                const refreshResponse = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/accounts/token/refresh/`,
                    { refresh: refreshToken }
                );
                const newAccessToken = refreshResponse.data.access;
                storage.setAccessToken(newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                storage.clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);