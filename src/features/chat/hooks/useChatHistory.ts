import { useState, useEffect, useRef, useCallback } from 'react';
import { getChatHistory } from '@/api/chat';
import { ChatMessage } from '@/types/chat';
import { useWebSocket } from './useWebSocket';

export const useChatHistory = (studyPk: number) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 무한 스크롤 및 다음 페이지 관리를 위한 상태
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextPageNum, setNextPageNum] = useState(1);

  // 채팅창 스크롤 제어를 위한 Ref
  const scrollRef = useRef<HTMLDivElement>(null);

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
      setMessages((prev) => [...prev, newMsg]);
      // 새 메시지 수신 시 맨 아래로 스크롤
      setTimeout(() => scrollToBottom('smooth'), 50);
  }, [scrollToBottom]);

  // 웹소켓 연결
  const { sendMessage } = useWebSocket({
      studyPk,
      onMessage: handleNewMessage,
  });

  /**
   * 초기 채팅 내역을 불러오는 함수
   */
  const fetchInitialHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getChatHistory(studyPk, 1);
      
      // API 명세의 results 배열을 상태에 저장
      setMessages(data.results);
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
      setMessages((prev) => [...data.results, ...prev]);
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