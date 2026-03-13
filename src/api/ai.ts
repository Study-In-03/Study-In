const CHATGPT_API_URL = import.meta.env.VITE_AI_API_URL ?? 'https://dev.wenivops.co.kr/services/openai-api';

export interface AiContext {
  title: string;
  subject: string;
  difficulty: string;
  durationWeeks: string;
  days: string[];
  curriculum?: string;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  '초급': '초급',
  '중급': '중급',
  '고급': '고급',
};

function buildMessages(context: AiContext, field: 'introduction' | 'schedule') {
  const { title, subject, difficulty, durationWeeks, days, curriculum } = context;
  const diffLabel = DIFFICULTY_LABEL[difficulty] ?? difficulty;
  const daysText = days.length > 0 ? days.join(', ') : '미정';
  const info = `스터디 제목: ${title || '미정'}\n주제: ${subject || '미정'}\n난이도: ${diffLabel || '미정'}\n기간: ${durationWeeks ? `${durationWeeks}주` : '미정'}\n진행 요일: ${daysText}`;

  if (field === 'schedule') {
    return [
      { role: 'system', content: '당신은 스터디 커리큘럼 설계 전문가입니다. 한국어로 답변해주세요.' },
      {
        role: 'user',
        content: `${info}\n\n위 정보를 바탕으로 주차별 커리큘럼을 작성해주세요. 각 주차는 "Week N: 주제명" 형식으로 한 줄씩만 작성하고, 세부 내용 없이 큰 주제명만 적어주세요. 전체 500자 이내로 작성해주세요.`,
      },
    ];
  }

  const curriculumSection = curriculum
    ? `\n\n커리큘럼:\n${curriculum}`
    : '';

  return [
    { role: 'system', content: '당신은 스터디 소개글 작성 전문가입니다. 한국어로 답변해주세요.' },
    {
      role: 'user',
      content: `${info}${curriculumSection}\n\n위 정보를 바탕으로 스터디 소개글을 작성해주세요. 반드시 1000자 이내로 작성해주세요.`,
    },
  ];
}

/** JSON 응답에서 타이프라이터 효과로 텍스트를 점진적으로 노출합니다. */
async function simulateStream(text: string, onChunk: (partial: string) => void): Promise<void> {
  const CHUNK = 4; // 한 번에 표시할 글자 수
  const DELAY = 20; // ms
  for (let i = CHUNK; i < text.length; i += CHUNK) {
    onChunk(text.slice(0, i));
    await new Promise<void>((resolve) => setTimeout(resolve, DELAY));
  }
  onChunk(text); // 마지막 전체 텍스트 전달
}

/**
 * 스트리밍 응답을 지원하는 AI 텍스트 생성 함수.
 * SSE(text/event-stream) 응답이면 청크마다 onChunk를 호출하고,
 * 일반 JSON 응답이면 타이프라이터 효과로 점진적으로 표시합니다.
 */
export async function generateAiTextStream(
  context: AiContext,
  field: 'introduction' | 'schedule',
  onChunk: (partial: string) => void,
): Promise<string> {
  const messages = buildMessages(context, field);
  const res = await fetch(CHATGPT_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  });
  if (!res.ok) throw new Error(`AI API error: ${res.status}`);

  const contentType = res.headers.get('content-type') ?? '';

  if (contentType.includes('text/event-stream') && res.body) {
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') return fullText;

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content ?? '';
          if (content) {
            fullText += content;
            onChunk(fullText);
          }
        } catch {
          // 손상된 청크 무시
        }
      }
    }

    return fullText;
  }

  // 폴백: 일반 JSON 응답 → 타이프라이터 효과로 점진적 표시
  const data = await res.json();
  const text = data.choices[0].message.content as string;
  await simulateStream(text, onChunk);
  return text;
}
