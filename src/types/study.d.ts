export type StudyDay = "월" | "화" | "수" | "목" | "금" | "토" | "일";

export interface StudyFormState {
  thumbnail: File | null;
  thumbnailPreview: string;
  title: string;
  studyType: string;
  location: string;
  maxMembers: string;
  introduction: string;
  schedule: string;
  leaderIntro: string;
  days: StudyDay[];
  startDate: string;
  durationWeeks: string;
  startTime: string;
  endTime: string;
  subject: string;
  difficulty: string;
  tags: string[];
}

export interface StudyFormErrors {
  thumbnail?: string;
  title?: string;
  studyType?: string;
  location?: string;
  maxMembers?: string;
  introduction?: string;
  schedule?: string;
  leaderIntro?: string;
  days?: string;
  startDate?: string;
  durationWeeks?: string;
  startTime?: string;
  endTime?: string;
  timeRange?: string;
  subject?: string;
  difficulty?: string;
  tags?: string;
}

export interface Study {
  id: number;
  thumbnail: string;
  title: string;
  is_offline: boolean;
  location: string | null;
  difficulty: '초급' | '중급' | '고급' | { id: number; name: string };
  topic: string;
  status: '모집 중' | '모집 완료' | '진행 중' | '완료';
  current_participants: number;
  is_liked: boolean;
}
