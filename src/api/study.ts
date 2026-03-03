import { axiosInstance } from './axios';
import type { StudyFormState } from '@/types/study';

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
// NOTE: 폼 라벨 "개념/학습"은 API name "개념학습"과 다름
const SUBJECT_MAP: Record<string, { id: number; name: string }> = {
  '개념/학습':    { id: 1, name: '개념학습' },
  '응용/활용':    { id: 2, name: '응용/활용' },
  '프로젝트':     { id: 3, name: '프로젝트' },
  '챌린지':       { id: 4, name: '챌린지' },
  '자격증/시험':  { id: 5, name: '자격증/시험' },
  '취업/코테':    { id: 6, name: '취업/코테' },
  '특강':         { id: 7, name: '특강' },
  '기타':         { id: 8, name: '기타' },
};

/**
 * 썸네일 이미지를 업로드하고 서버 경로를 반환한다.
 * NOTE: 응답 필드명(image_url)은 파일업로더 API 명세 확인 후 조정 필요
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
    study_day: form.days.map((day) => ({ id: DAY_MAP[day], name: day })),
    start_date: form.startDate,
    term: parseInt(form.durationWeeks, 10),
    // TimePicker는 "HH:MM" 형식 → API는 "HH:MM:00" 요구
    start_time: `${form.startTime}:00`,
    end_time: `${form.endTime}:00`,
    difficulty: DIFFICULTY_MAP[form.difficulty],
    subject: SUBJECT_MAP[form.subject],
    search_tag: form.tags.map((name) => ({ name })),
  };

  // 오프라인이고 지역 ID가 있을 때만 포함
  // 프로필 API 연동 시 사용자 인증 지역 ID(preferred_region.id)로 교체
  if (form.studyType === 'offline' && locationId != null) {
    payload.study_location = { id: locationId };
  }

  return payload;
}

/**
 * 스터디를 생성하고 생성된 id를 반환한다.
 * @param locationId 오프라인 스터디의 지역 ID (프로필 API 연동 시 실제 값으로 주입)
 */
export async function createStudy(
  form: StudyFormState,
  thumbnailUrl: string,
  locationId?: number,
): Promise<{ id: number }> {
  const payload = buildStudyPayload(form, thumbnailUrl, locationId);
  const res = await axiosInstance.post<{ id: number }>('/study/', payload);
  return res.data;
}

/**
 * 스터디 삭제
 */
export async function deleteStudy(studyId: number): Promise<void> {
  await axiosInstance.delete(`/study/${studyId}/`);
}

/**
 * 스터디 수정, partial update 지원 — 변경할 필드만 포함해도 됨.
 * @param studyId  수정할 스터디 ID
 * @param locationId 오프라인 스터디의 지역 ID (프로필 API 연동 시 실제 값으로 주입)
 */
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
