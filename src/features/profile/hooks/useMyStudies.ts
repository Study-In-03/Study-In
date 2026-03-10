import { useState, useEffect } from 'react';
import { getMyStudies, getParticipatingStudies, getMyClosedStudies, getLikedStudies } from '@/api/study';
import { toAbsoluteUrl } from '@/utils/study';

export interface MyStudyItem {
  id: number;
  title: string;
  thumbnail: string | null;
  study_status: { id: number; name: string };
  is_offline?: boolean;
  location?: string;
  difficulty?: { id: number; name: string };
  subject?: { id: number; name: string };
  recruitment?: number;
  current_participants?: number;
  is_liked?: boolean;
  start_date?: string;
  end_date?: string;
}

export const useMyStudies = (endpoint: string | null) => {
  const [studies, setStudies] = useState<MyStudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!endpoint) {
      setStudies([]);
      return;
    }

    let cancelled = false;
    const fetchStudies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const API_MAP: Record<string, () => Promise<any[]>> = {
          '/study/my-study/': getMyStudies,
          '/study/my-participating-study/': getParticipatingStudies,
          '/study/my-closed-study/': getMyClosedStudies,
          '/study/my-like-study/': getLikedStudies,
        };
        const fetcher = API_MAP[endpoint];
        const raw = fetcher ? await fetcher() : [];
        if (!cancelled) {
          setStudies(raw.map((s: MyStudyItem) => ({ ...s, thumbnail: toAbsoluteUrl(s.thumbnail) })));
        }
      } catch {
        if (!cancelled) setError('스터디 목록을 불러오는 데 실패했습니다.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchStudies();
    return () => {
      cancelled = true;
    };
  }, [endpoint]);

  return { studies, isLoading, error };
};
