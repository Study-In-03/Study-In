import { useEffect, useRef, useCallback, useState } from 'react';
import { storage } from '@/utils/storage';
import { ChatMessage } from '@/types/chat';

const WS_BASE = import.meta.env.VITE_WS_BASE_URL || 'wss://api.wenivops.co.kr/services/studyin-chat/chat/study';
const PING_INTERVAL = 30000; // 30초 핑 유지
const MAX_RECONNECT_ATTEMPTS = 5; // 최대 재연동 시도 횟수
const INITIAL_RECONNECT_DELAY = 1000; // 초기 재연동 대기 시간 (1초)

interface UseWebSocketProps {
    studyPk: number;
    onMessage: (message: ChatMessage) => void;
}

export const useWebSocket = ({ studyPk, onMessage }: UseWebSocketProps) => {
    const wsRef = useRef<WebSocket | null>(null);
    const pingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const reconnectCountRef = useRef(0);
    const onMessageRef = useRef(onMessage);
    
    // 연결 상태를 UI에 피드백하기 위한 상태 (선택 사항)
    const [status, setStatus] = useState<'CONNECTING' | 'OPEN' | 'CLOSED'>('CLOSED');

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const connect = useCallback(() => {
        if (!studyPk) return;

        const token = storage.getAccessToken();
        if (!token) {
            console.warn('[WS] 토큰 없음 — 웹소켓 연결 불가');
            return;
        }

        setStatus('CONNECTING');
        const url = `${WS_BASE}/${studyPk}/?token=${token}`;
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[WS] 연결 성공');
            setStatus('OPEN');
            reconnectCountRef.current = 0; // 연결 성공 시 재시도 횟수 초기화

            // 30초마다 핑 전송 (연결 유지)
            pingTimerRef.current = setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, PING_INTERVAL);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.error) {
                    console.error('[WS] 서버 에러:', data.error);
                    return;
                }
                const SYSTEM_TYPES = ['pong', 'connection_success', 'connection_warning'];
                if (!SYSTEM_TYPES.includes(data.type)) {
                    onMessageRef.current(data);
                }
            } catch (e) {
                console.error('[WS] 메시지 파싱 에러:', e);
            }
        };

        ws.onerror = (err) => {
            console.error('[WS] 오류 발생:', err);
        };

        ws.onclose = (event) => {
            setStatus('CLOSED');
            if (pingTimerRef.current) {
                clearInterval(pingTimerRef.current);
                pingTimerRef.current = null;
            }

            // 비정상 종료 시 재연동 시도 (지수 백오프, 인증/권한 에러는 재연결 불필요)
            const NO_RETRY_CODES = [4001, 4002, 4003, 4004, 4005];
            if (!event.wasClean && !NO_RETRY_CODES.includes(event.code) && reconnectCountRef.current < MAX_RECONNECT_ATTEMPTS) {
                const delay = INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectCountRef.current);
                console.log(`[WS] ${delay}ms 후 재연동 시도... (${reconnectCountRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`);
                
                setTimeout(() => {
                    reconnectCountRef.current += 1;
                    connect();
                }, delay);
            }
        };
    }, [studyPk]);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) {
                wsRef.current.close(1000, 'Component Unmounted');
                wsRef.current = null;
            }
        };
    }, [connect]);

    const sendMessage = useCallback((content: string, type: 'text' | 'image' | 'file' = 'text') => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.warn('[WS] 연결되지 않은 상태입니다.');
            return;
        }
        const payload =
            type === 'image' ? { type, image_url: content } :
            type === 'file'  ? { type, file_url: content } :
                               { type, message: content };
        ws.send(JSON.stringify(payload));
    }, []);

    return { sendMessage, status };
};