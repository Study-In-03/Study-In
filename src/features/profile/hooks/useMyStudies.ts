import { useState, useEffect } from 'react';
import { getMyStudies, getParticipatingStudies, getMyClosedStudies, getLikedStudies } from '@/api/study';
import { normalizeStudy } from '@/utils/study';
import type { Study } from '@/types/study';

type TabKey = 'my' | 'joined' | 'ended' | 'liked';

const API_MAP: Record<TabKey, () => Promise<any[]>> = {
  my: getMyStudies,
  joined: getParticipatingStudies,
  ended: getMyClosedStudies,
  liked: getLikedStudies,
};

export const useMyStudies = (tab: TabKey | null) => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tab) {
      setStudies([]);
      return;
    }

    let cancelled = false;
    const fetchStudies = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const raw = await API_MAP[tab]();
        if (!cancelled) {
          setStudies(raw.map(normalizeStudy));
        }
      } catch {
        if (!cancelled) setError('스터디 목록을 불러오는 데 실패했습니다.');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchStudies();
    return () => { cancelled = true; };
  }, [tab]);

  return { studies, isLoading, error };
};