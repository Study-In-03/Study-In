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
  study_location: { id: number; sort_order: number; location: string } | null;
  difficulty: { id: number; name: string };
  subject: { id: number; name: string };
  study_status: { id: number; name: string };
  participant_count: number;
  user_liked: boolean;
}