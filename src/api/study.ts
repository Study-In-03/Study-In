import { axiosInstance } from './axios';
import type { StudyFormState } from '@/types/study';

export interface StudyApiData {
  id: number;
  title: string;
  thumbnail: string;
  is_offline: boolean;
  recruitment: number;
  study_info: string;
  schedule_info?: string;
  leader_intro?: string;
  study_day: { id: number; name: string }[];
  start_date: string;
  term: number;
  start_time: string;
  end_time: string;
  difficulty: { id: number; name: string };
  subject: { id: number; name: string };
  search_tag: { id: number; name: string }[];
  study_location?: { id: number; location: string };
  leader: {
    id: number;
    profile: {
      nickname: string;
      introduction: string;
      profile_img: string;
      preferred_region: { id: number; sort_order: number; location: string } | null;
      grade: string;
    };
  };
  participants: {
    id: number;
    profile: {
      nickname: string;
      introduction: string;
      profile_img: string;
      preferred_region: { id: number; sort_order: number; location: string } | null;
      grade: string;
    };
  }[];
  study_status: { id: number; name: string };
  like_users: number[];
}

// 요일 이름 → API {id, name} 매핑 (백엔드 순서 기준: 월=1 ~ 일=7)
const DAY_MAP: Record<string, number> = {
  월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6, 일: 7,
};

// 난이도 폼값 → API {id, name}
const DIFFICULTY_MAP: Record<string, { id: number; name: string }> = {
  beginner:     { id: 1, name: '초급' },
  intermediate: { id: 2, name: '중급' },
  advanced:     { id: 3, name: '고급' },
};

// 스터디 주제 폼값 → API {id, name}
const SUBJECT_MAP: Record<string, { id: number; name: string }> = {
  '개념/학습':   { id: 1, name: '개념학습' },
  '응용/활용':   { id: 2, name: '응용/활용' },
  '프로젝트':    { id: 3, name: '프로젝트' },
  '챌린지':      { id: 4, name: '챌린지' },
  '자격증/시험': { id: 5, name: '자격증/시험' },
  '취업/코테':   { id: 6, name: '취업/코테' },
  '특강':        { id: 7, name: '특강' },
  '기타':        { id: 8, name: '기타' },
};

/**
 * 썸네일 이미지를 업로드하고 서버 경로 반환.
 */
export async function uploadStudyThumbnail(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await axiosInstance.post<{ image_url: string }>(
    '/file-uploader/image/',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return res.data.image_url;
}

/** form + thumbnail → API payload 공통 빌더 */
function buildStudyPayload(
  form: StudyFormState,
  thumbnailUrl: string,
  locationId?: number,
): Record<string, unknown> {
  const payload: Record<string, unknown> = {
    title: form.title,
    thumbnail: thumbnailUrl,
    is_offline: form.studyType === 'offline',
    recruitment: Number(form.maxMembers),
    study_info: form.introduction,
    schedule_info: form.schedule,
    leader_intro: form.leaderIntro,
    study_day: form.days.map((day) => ({ id: DAY_MAP[day], name: day })),
    start_date: form.startDate,
    term: parseInt(form.durationWeeks, 10),
    start_time: `${form.startTime}:00`,
    end_time: `${form.endTime}:00`,
    difficulty: DIFFICULTY_MAP[form.difficulty],
    subject: SUBJECT_MAP[form.subject],
    search_tag: form.tags.map((name) => ({ name })),
  };

  if (form.studyType === 'offline' && locationId != null) {
    payload.study_location = { id: locationId };
  }

  return payload;
}

/** 스터디 주제 카테고리 목록 조회 */
export async function getStudySubjects(): Promise<{ id: number; name: string }[]> {
  const res = await axiosInstance.get<{ id: number; name: string }[]>('/study/subject/');
  return res.data;
}

/** 스터디 난이도 카테고리 목록 조회 */
export async function getStudyDifficulties(): Promise<{ id: number; name: string }[]> {
  const res = await axiosInstance.get<{ id: number; name: string }[]>('/study/difficulty/');
  return res.data;
}

/** 검색 태그 카테고리 목록 조회 */
export async function getStudySearchTags(): Promise<{ id: number; name: string }[]> {
  const res = await axiosInstance.get<{ id: number; name: string }[]>('/study/searchtag/');
  return res.data;
}

/** 스터디 생성 */
export async function createStudy(
  form: StudyFormState,
  thumbnailUrl: string,
  locationId?: number,
): Promise<{ id: number }> {
  const payload = buildStudyPayload(form, thumbnailUrl, locationId);
  const res = await axiosInstance.post<{ id: number }>('/study/', payload);
  return res.data;
}

/** 스터디 단건 조회 */
export async function getStudy(studyId: number): Promise<StudyApiData> {
  const res = await axiosInstance.get<StudyApiData>(`/study/${studyId}/`);
  return res.data;
}

/** 스터디 삭제 */
export async function deleteStudy(studyId: number): Promise<void> {
  await axiosInstance.delete(`/study/${studyId}/`);
}

/** 스터디 수정 */
export async function updateStudy(
  studyId: number,
  form: StudyFormState,
  thumbnailUrl: string,
  locationId?: number,
): Promise<{ id: number }> {
  const payload = buildStudyPayload(form, thumbnailUrl, locationId);
  const res = await axiosInstance.put<{ id: number }>(`/study/${studyId}/`, payload);
  return res.data;
}

/** 스터디 좋아요 - POST /study/{study_pk}/like/ */
export async function likeStudy(studyId: number): Promise<void> {
  await axiosInstance.post(`/study/${studyId}/like/`);
}

/** 스터디 좋아요 취소 - DELETE /study/{study_pk}/like/ */
export async function unlikeStudy(studyId: number): Promise<void> {
  await axiosInstance.delete(`/study/${studyId}/like/`);
}

/** 좋아요한 스터디 목록 - GET /study/my-like-study/ */
export async function getLikedStudies(): Promise<StudyApiData[]> {
  const res = await axiosInstance.get<StudyApiData[]>('/study/my-like-study/');
  return res.data;
}

/** 내가 참여 중인 스터디 목록 - GET /study/my-participating-study/ */
export async function getParticipatingStudies(): Promise<StudyApiData[]> {
  const res = await axiosInstance.get<StudyApiData[]>('/study/my-participating-study/');
  return res.data;
}
