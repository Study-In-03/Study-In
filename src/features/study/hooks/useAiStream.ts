import { useState, useCallback } from "react";

export type AiField = "introduction" | "schedule" | "leaderIntro";

export function useAiStream() {
  const [isLoading, setIsLoading] = useState(false);

  // AI API 연동 시 스트리밍 로직으로 교체
  const trigger = useCallback((field: AiField) => {
    console.log(`[useAiStream] trigger → field: ${field}`);

    setIsLoading(true);
    // 스텁: 로딩 UI 전환 확인용 딜레이 (실제 구현 시 제거)
    setTimeout(() => {
      console.log(`[useAiStream] done → field: ${field}`);
      setIsLoading(false);
    }, 1500);
  }, []);

  return { isLoading, trigger };
}
