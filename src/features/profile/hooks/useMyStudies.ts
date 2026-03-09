import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../api/axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
function toAbsoluteUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

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
        const res = await axiosInstance.get<MyStudyItem[]>(endpoint);
        if (!cancelled) {
          const raw = Array.isArray(res.data) ? res.data : [];
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
