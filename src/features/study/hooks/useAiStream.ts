import { useState, useCallback } from "react";
import { generateAiTextStream } from "@/api/ai";
import type { AiContext } from "@/api/ai";

export function useAiStream(
  onResult: (field: "schedule" | "introduction", text: string) => void,
) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 커리큘럼(schedule) → 소개글(introduction) 순차 스트리밍 생성.
   * existingSchedule 이 있으면 커리큘럼 생성을 건너뛰고 바로 소개글 생성.
   * 각 단계에서 청크가 도착할 때마다 onResult 를 호출해 실시간으로 필드를 업데이트합니다.
   */
  const trigger = useCallback(
    async (context: AiContext, existingSchedule: string) => {
      setIsLoading(true);
      try {
        let curriculum = existingSchedule;

        if (!curriculum) {
          curriculum = await generateAiTextStream(
            context,
            "schedule",
            (partial) => onResult("schedule", partial),
          );
        }

        await generateAiTextStream(
          { ...context, curriculum },
          "introduction",
          (partial) => onResult("introduction", partial),
        );
      } catch {
        // 에러 시 조용히 실패
      } finally {
        setIsLoading(false);
      }
    },
    [onResult],
  );

  return { isLoading, trigger };
}
