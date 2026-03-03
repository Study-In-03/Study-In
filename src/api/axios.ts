import axios from 'axios';
import { storage } from '../utils/storage';

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
    (response) => response, // 성공한 응답은 그냥 통과
    
    async (error) => {
        // 방금 실패한 원래의 요청 정보
        const originalRequest = error.config;

        // 401 에러(권한 없음/토큰 만료)가 났고, 재시도를 안 한 요청일 경우
        if (error.response?.status === 401 && !originalRequest._retry) {
            // 무한 루프 방지를 위해 표시 남김
            originalRequest._retry = true;

            const refreshToken = storage.getRefreshToken();
            
            // refresh 토큰조차 없으면 무조건 로그인 페이지로 이동
            if (!refreshToken) {
                storage.clearAuth();
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // refresh 토큰으로 새 토큰 발급 요청 (위니브 API 기준)
                const refreshResponse = await axios.post(
                `${import.meta.env.VITE_API_BASE_URL}/accounts/token/refresh/`, 
                { refresh: refreshToken }
                );

                // 성공적으로 새 토큰 받음
                const newAccessToken = refreshResponse.data.access;
                
                // 금고에 새 토큰 저장
                storage.setAccessToken(newAccessToken);
                
                // 실패했던 원래 요청의 헤더를 새 토큰으로 갈아끼우기
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                
                // 실패했던 원래 요청 다시 전송 
                return axiosInstance(originalRequest);
                
            } catch (refreshError) {
                // refresh 토큰으로 갱신 실패 경우 (로그인 만료)
                // 스토리지 싹 비우고 로그인 페이지로 강제 이동
                storage.clearAuth();
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
            }

        // 401 에러가 아니거나, 다른 에러면 그냥 에러 출력
        return Promise.reject(error);
    }
);