import type { Study } from '@/types/study';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export function toAbsoluteUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
}

type RawStudy = {
  id: number;
  title: string;
  thumbnail?: string | null;
  is_offline?: boolean;
  study_location?: { id: number; location: string } | null;
  difficulty?: { name: string } | string;
  subject?: { name: string } | string;
  study_status?: { name: string };
  participant_count?: number;
  current_participants?: number;
  user_liked?: boolean;
  is_liked?: boolean;
};

export function normalizeStudy(s: RawStudy): Study {
  return {
    id: s.id,
    title: s.title,
    thumbnail: toAbsoluteUrl(s.thumbnail),
    is_offline: s.is_offline ?? false,
    location: s.study_location?.location ?? null,
    difficulty: (typeof s.difficulty === 'object' ? s.difficulty?.name : s.difficulty) ?? '',
    topic: (typeof s.subject === 'object' ? s.subject?.name : s.subject) ?? '',
    status: s.study_status?.name === '완료' ? '종료' : (s.study_status?.name ?? ''),
    current_participants: s.participant_count ?? s.current_participants ?? 0,
    is_liked: s.user_liked ?? s.is_liked ?? false,
  } as Study;
}
