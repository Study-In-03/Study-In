export const STATUS_COLOR: Record<string, string> = {
  "모집 중": "text-primary",
  "모집 완료": "text-gray-500",
  "진행 중": "text-warning",
  "완료": "text-gray-400",
};

export const STUDY_TABS = ["최신 스터디", "모집 중 스터디", "진행 중 스터디"] as const;
export type StudyTab = typeof STUDY_TABS[number];
export const DEFAULT_STUDY_TAB: StudyTab = "최신 스터디";
