import type { Study } from '@/types/study';
import { getFullUrl } from '@/api/upload'

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
    thumbnail: getFullUrl(s.thumbnail ?? null),
    is_offline: s.is_offline ?? false,
    location: s.study_location?.location ?? null,
    difficulty: (typeof s.difficulty === 'object' ? s.difficulty?.name : s.difficulty) ?? '',
    topic: (typeof s.subject === 'object' ? s.subject?.name : s.subject) ?? '',
    status: (s.study_status?.name ?? '') as Study['status'],
    current_participants: s.participant_count ?? s.current_participants ?? 0,
    is_liked: s.user_liked ?? s.is_liked ?? false,
  } as Study;
}
