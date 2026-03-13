import { useState, useEffect, useRef, useCallback } from 'react';
import { getChatHistory } from '@/api/chat';
import { getProfile } from '@/api/profile';
import { ChatMessage } from '@/types/chat';
import { useWebSocket, normalizeChatMessage } from './useWebSocket';
import { storage } from '@/utils/storage';
import { useAuthStore } from '@/store/authStore';

export const useChatHistory = (studyPk: number) => {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 무한 스크롤 및 다음 페이지 관리를 위한 상태
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextPageNum, setNextPageNum] = useState(1);

  // 채팅창 스크롤 제어를 위한 Ref
  const scrollRef = useRef<HTMLDivElement>(null);

  // 내 프로필 이미지 (optimistic update용)
  const myProfileImgRef = useRef<string | null>(storage.getProfileImg());

  useEffect(() => {
    const myId = storage.getUserId();
    if (!myId) return;
    getProfile(myId).then((profile) => {
      myProfileImgRef.current = profile.profile_img || null;
      if (profile.profile_img) storage.setProfileImg(profile.profile_img);
    }).catch(() => {});
  }, []);

  /**
   * 스크롤을 맨 아래로 이동시키는 함수
   */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior,
      });
    }
  }, []);

  // 웹소켓 수신 메시지 처리
  const handleNewMessage = useCallback((newMsg: ChatMessage) => {
      // 서버가 내 메시지를 에코로 돌려보내는 경우 → optimistic update로 이미 추가됐으므로 무시
      const myId = Number(storage.getUserId());
      if (myId && Number(newMsg.user?.pk) === myId) return;
      setMessages((prev) => [...prev, newMsg]);
      // 새 메시지 수신 시 맨 아래로 스크롤
      setTimeout(() => scrollToBottom('smooth'), 50);
  }, [scrollToBottom]);

  // 웹소켓 연결
  const { sendMessage: wsSend } = useWebSocket({
      studyPk,
      onMessage: handleNewMessage,
  });

  // 메시지 전송 + optimistic update (서버가 sender에게 에코를 보내지 않으므로 직접 추가)
  const sendMessage = useCallback((content: string, type: 'text' | 'image' | 'file' = 'text') => {
      const optimisticMsg: ChatMessage = {
          pk: Date.now() * -1, // 임시 음수 pk (서버 pk와 충돌 없음)
          user: {
              pk: storage.getUserId(),
              profile: {
                  nickname: user?.nickname || storage.getNickname() || '',
                  profile_img: myProfileImgRef.current,
              },
          },
          chat_type: type,
          message: type === 'text' ? content : null,
          image_url: type === 'image' ? content : null,
          file_url: type === 'file' ? content : null,
          created: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, optimisticMsg]);
      setTimeout(() => scrollToBottom('smooth'), 50);
      wsSend(content, type);
  }, [wsSend, scrollToBottom]);

  /**
   * 초기 채팅 내역을 불러오는 함수
   */
  const fetchInitialHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getChatHistory(studyPk, 1);
      
      // API 명세의 results 배열을 상태에 저장
      setMessages(data.results.map(normalizeChatMessage));
      setHasNextPage(!!data.next);
      if (data.next) setNextPageNum(2);
      
      // 첫 로딩 시에는 즉시 하단으로 이동
      setTimeout(() => scrollToBottom('auto'), 100);
    } catch (err) {
      setError('채팅 내역을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [studyPk, scrollToBottom]);

  /**
   * (옵션) 이전 메시지 더 보기 (무한 스크롤용)
   */
  const fetchMoreHistory = useCallback(async () => {
    if (!hasNextPage || isLoading) return;

    try {
      setIsLoading(true);
      const data = await getChatHistory(studyPk, nextPageNum);
      
      // 이전 메시지는 배열의 앞에 추가
      setMessages((prev) => [...data.results.map(normalizeChatMessage), ...prev]);
      setHasNextPage(!!data.next);
      setNextPageNum((prev) => prev + 1);
    } catch (err) {
      console.error('이전 메시지를 불러오는데 실패했습니다.', err);
    } finally {
      setIsLoading(false);
    }
  }, [studyPk, hasNextPage, nextPageNum, isLoading]);

  // 스터디 PK가 변경될 때마다 내역 초기화 및 로드
  useEffect(() => {
    if (studyPk) {
      fetchInitialHistory();
    }
  }, [studyPk, fetchInitialHistory]);

  return {
    messages,
    isLoading,
    error,
    scrollRef,
    scrollToBottom,
    sendMessage,    
    fetchMoreHistory,
    hasNextPage,
  };
};