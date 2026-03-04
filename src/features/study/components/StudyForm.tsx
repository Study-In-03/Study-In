import { useState, useRef, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent, FormEvent, RefObject } from "react";
import iconImage from "@/assets/base/icon-Image.svg";
import iconLocation from "@/assets/base/icon-location.svg";
import iconClock from "@/assets/base/icon-clock.svg";
import iconCalendar from "@/assets/base/icon-Calendar.svg";
import iconHelpCircle from "@/assets/base/icon-help-circle.svg";
import radioBtnOff from "@/assets/base/radio-btn-OFF.svg";
import radioBtnOn from "@/assets/base/radio-btn-ON.svg";
import iconBtnX from "@/assets/base/icon-btn-X.svg";
import type { StudyFormState, StudyFormErrors, StudyDay } from "@/types/study";

const DAYS: StudyDay[] = ["월", "화", "수", "목", "금", "토", "일"];

const STUDY_TYPES = [
  { value: "offline", label: "내 지역" },
  { value: "online", label: "온라인" },
];

const DURATIONS = ["1주", "2주", "4주", "6주", "8주", "10주", "12주", "16주"];

const SUBJECTS = [
  "개념/학습",
  "응용/활용",
  "프로젝트",
  "챌린지",
  "자격증/시험",
  "취업/코테",
  "특강",
  "기타",
];

const DIFFICULTIES = [
  { value: "beginner", label: "초급" },
  { value: "intermediate", label: "중급" },
  { value: "advanced", label: "고급" },
];

const TAG_OPTIONS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Vue",
  "Angular",
  "Python",
  "Java",
  "Spring",
  "Node.js",
  "Express",
  "Flutter",
  "Swift",
  "Kotlin",
  "Go",
  "Rust",
  "알고리즘",
  "자료구조",
  "CS",
  "데이터베이스",
  "네트워크",
  "AWS",
  "Docker",
  "Git",
  "머신러닝",
  "딥러닝",
  "데이터분석",
  "SQL",
  "포트폴리오",
  "취업",
  "코딩테스트",
];

const MAX_TITLE_MOBILE = 80;
const MAX_TITLE_DESKTOP = 50;
const MAX_INTRO = 1000;
const MAX_SCHEDULE = 500;
const MAX_TAGS = 5;

interface StudyFormProps {
  form: StudyFormState;
  errors: StudyFormErrors;
  tagInput: string;
  isValid: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  setTagInput: (value: string) => void;
  updateField: <K extends keyof StudyFormState>(
    key: K,
    value: StudyFormState[K],
  ) => void;
  handleThumbnailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleDayToggle: (day: StudyDay) => void;
  handleAddTag: () => void;
  handleAddTagDirect: (tag: string) => void;
  handleRemoveTag: (tag: string) => void;
  handleTagInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleBlurField: (key: keyof StudyFormState) => void;
  handleSubmit: (e: FormEvent) => void;
  handleReset: () => void;
  // 프로필에서 인증된 지역 — 추후 API 연결 시 실제 값으로 주입
  userLocation?: string;
}

function SelectPicker({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between h-10 bg-background border rounded-lg pl-[14px] pr-[10px] transition-colors ${
          open ? "border-primary" : "border-gray-300"
        }`}
      >
        <span className={`text-[14px] font-regular ${value ? "text-gray-900" : "text-gray-500"}`}>
          {value || placeholder}
        </span>
        <svg
          className={`w-4 h-4 shrink-0 text-gray-300 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 w-full bg-background border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full px-[14px] py-2.5 text-[14px] text-left transition-colors ${
                  opt === value
                    ? "bg-primary text-background"
                    : "text-gray-900 hover:bg-gray-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TimePicker({
  value,
  onChange,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hh, mm] = (value || "00:00").split(":");
  const hour = (hh ?? "00").padStart(2, "0");
  const minute = (mm ?? "00").padStart(2, "0");

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className={`relative flex-1 min-w-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between h-10 bg-background border rounded-lg pl-[14px] pr-[10px] transition-colors ${
          open ? "border-primary" : "border-gray-300"
        }`}
      >
        <span className="text-base font-normal text-gray-900">{hour} : {minute}</span>
        <img src={iconClock} alt="" className="w-5 h-5 shrink-0" />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 z-20 bg-background border border-gray-300 rounded-lg shadow-md flex overflow-hidden w-full">
          {/* 시 */}
          <div className="flex-1 h-44 overflow-y-auto">
            {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0")).map((hv) => (
              <button
                key={hv}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(`${hv}:${minute}`);
                }}
                className={`w-full py-2 text-sm text-center transition-colors ${
                  hv === hour
                    ? "bg-primary text-background"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {hv}
              </button>
            ))}
          </div>
          <div className="w-px bg-gray-100 shrink-0" />
          {/* 분 */}
          <div className="flex-1 h-44 overflow-y-auto">
            {Array.from({ length: 6 }, (_, i) => String(i * 10).padStart(2, "0")).map((mv) => (
              <button
                key={mv}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(`${hour}:${mv}`);
                }}
                className={`w-full py-2 text-sm text-center transition-colors ${
                  mv === minute
                    ? "bg-primary text-background"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {mv}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudyForm({
  form,
  errors,
  tagInput,
  fileInputRef,
  setTagInput,
  updateField,
  handleThumbnailChange,
  handleDayToggle,
  handleAddTagDirect,
  handleRemoveTag,
  handleTagInputKeyDown,
  handleBlurField,
  handleSubmit,
  userLocation,
}: StudyFormProps) {
  const [isTagFocused, setIsTagFocused] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia("(min-width: 1024px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const MAX_TITLE = isDesktop ? MAX_TITLE_DESKTOP : MAX_TITLE_MOBILE;
  const dateInputRef = useRef<HTMLInputElement>(null);
  const dateContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dateContainerRef.current && !dateContainerRef.current.contains(e.target as Node)) {
        setIsDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredTagOptions = TAG_OPTIONS.filter(
    (t) =>
      !form.tags.includes(t) &&
      (tagInput === "" || t.toLowerCase().includes(tagInput.toLowerCase())),
  ).slice(0, 8);

  const showTagDropdown =
    isTagFocused &&
    form.tags.length < MAX_TAGS &&
    filteredTagOptions.length > 0;

  return (
    <form id="study-create-form" onSubmit={handleSubmit} noValidate>
      {/* ── 카드: 대표이미지 ~ 모집인원 ── */}
      <div className="mx-4 mt-10 rounded-2xl border border-gray-300 overflow-hidden bg-background lg:mx-0 lg:flex lg:flex-row lg:min-h-[390px]">
        {/* 대표 이미지 */}
        <label
          htmlFor="thumbnail-input"
          className="relative w-full min-h-[358px] bg-gray-100 cursor-pointer block lg:w-1/3 lg:min-h-0 lg:shrink-0"
        >
          {form.thumbnailPreview ? (
            <img
              src={form.thumbnailPreview}
              alt="대표 이미지"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
              <p className="text-sm font-regular text-gray-500">
                대표 이미지 삽입
              </p>
              <p className="text-xs text-gray-500">(권장 사이즈 1200*1200px)</p>
            </div>
          )}
          {!form.thumbnailPreview && (
            <div className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-background shadow flex items-center justify-center">
              <img src={iconImage} alt="" className="w-5 h-5" />
            </div>
          )}
          <input
            id="thumbnail-input"
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleThumbnailChange}
          />
        </label>
        {errors.thumbnail && (
          <p className="px-4 pt-1.5 text-xs text-error">{errors.thumbnail}</p>
        )}

        {/* 스터디 제목 / 유형 / 지역 / 모집인원 */}
        <div className="px-4 pt-5 pb-5 space-y-5 lg:space-y-0 lg:flex-1 lg:px-3xl lg:flex lg:flex-col lg:pb-[64px]">
          {/* 스터디 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 lg:text-lg lg:font-bold">
              스터디 제목 <span className="text-error">*</span>
            </label>
            <textarea
              maxLength={MAX_TITLE}
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              onBlur={() => handleBlurField("title")}
              placeholder="스터디 제목 입력"
              className="w-full h-[100px] lg:h-[50px] overflow-hidden border border-gray-100 rounded-lg px-3 py-[13px] text-sm lg:text-lg focus:outline-none focus:border-primary-light transition-colors resize-none"
            />
            <div className="flex justify-between mt-1">
              {errors.title ? (
                <p className="text-xs text-error">{errors.title}</p>
              ) : (
                <span />
              )}
              <span className="text-xs lg:text-sm text-gray-500 ml-auto">
                {form.title.length}/{MAX_TITLE}
              </span>
            </div>
          </div>

          {/* 구분선 */}
          <div className="-mx-4 lg:-mx-[30px] border-t border-gray-100 lg:!mt-[30px]" />

          {/* 스터디 유형 */}
          <div className="flex items-start gap-4 lg:gap-0 lg:!mt-[30px] lg:grid lg:grid-cols-[140px_1fr] lg:items-start">
            <span className="shrink-0 text-sm font-normal text-gray-700 lg:text-lg lg:font-bold lg:pt-0.5">
              스터디 유형 <span className="text-error">*</span>
            </span>
            <div>
              <div className="flex gap-5">
                {STUDY_TYPES.map(({ value, label }) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => updateField("studyType", value)}
                  >
                    <img
                      src={form.studyType === value ? radioBtnOn : radioBtnOff}
                      alt={form.studyType === value ? "선택됨" : "선택 안됨"}
                      className="w-[18px] h-[18px] shrink-0"
                    />
                    <span className="text-sm lg:text-lg text-gray-700">
                      {label}
                    </span>
                  </label>
                ))}
              </div>
              {form.studyType === "offline" && (
                <p className="mt-2 text-sm lg:text-base flex items-center gap-1">
                  <img src={iconLocation} alt="" className="w-3.5 h-3.5" />
                  <span className="text-primary">{userLocation ?? "내 지역"}</span>
                  <span className="text-gray-700">에서 스터디원을 모집합니다.</span>
                </p>
              )}
              {errors.studyType && (
                <p className="mt-1 text-xs text-error">{errors.studyType}</p>
              )}
            </div>
          </div>

          {/* spacer: 스터디 유형 아래 공간을 채워 모집 인원을 하단으로 밀기 */}
          <div className="hidden lg:block lg:flex-1" />

          {/* 모집 인원 */}
          <div className="mt-4 flex items-center gap-4 lg:gap-0 lg:mt-0 lg:grid lg:grid-cols-[140px_1fr] lg:items-center">
            <span className="shrink-0 text-sm font-medium text-gray-700 lg:text-lg lg:font-bold whitespace-nowrap">
              모집 인원 <span className="text-error">*</span>
              <img src={iconHelpCircle} alt="도움말" className="ml-1 w-4 h-4 inline-block" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={3}
                  max={99}
                  value={form.maxMembers}
                  onChange={(e) => updateField("maxMembers", e.target.value)}
                  onBlur={() => handleBlurField("maxMembers")}
                  placeholder="3"
                  className="w-[60px] lg:w-16 border-0 border-b border-gray-500 px-1 py-1 text-sm lg:text-lg text-center focus:outline-none focus:border-primary-light transition-colors bg-transparent"
                />
                <span className="text-sm lg:text-lg text-gray-700">명</span>
              </div>
              {errors.maxMembers && (
                <p className="mt-1 text-xs text-error">{errors.maxMembers}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* ── 카드 끝 ── */}

      {/* ── 소개 / 일정 ── */}
      <div className="bg-background px-4 pt-6 pb-4 mt-4 space-y-5 lg:px-0 lg:pt-10 lg:pb-10 lg:space-y-[50px]">

        {/* 스터디 소개 */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2 lg:text-3xl lg:font-bold lg:mb-4">
            스터디 소개
          </label>
          <textarea
            maxLength={MAX_INTRO}
            value={form.introduction}
            onChange={(e) => updateField("introduction", e.target.value)}
            placeholder="스터디 소개를 입력해 주세요."
            className="w-full min-h-[288px] lg:min-h-[340px] border border-gray-300 rounded-xl px-4 py-2.5 text-sm lg:text-base focus:outline-none focus:border-primary-light transition-colors resize-none"
          />
          <p className="text-xs lg:text-base text-gray-300 text-right mt-1">
            {form.introduction.length}/{MAX_INTRO}
          </p>
        </div>

        {/* 스터디 일정 */}
        <div>
          <label className="block text-lg font-medium text-gray-700 mb-2 lg:text-3xl lg:font-bold lg:mb-4">
            스터디 일정
          </label>
          <textarea
            maxLength={MAX_SCHEDULE}
            value={form.schedule}
            onChange={(e) => updateField("schedule", e.target.value)}
            placeholder="스터디 일정을 입력해 주세요."
            className="w-full min-h-[288px] lg:min-h-[196px] border border-gray-300 rounded-xl px-4 py-2.5 text-sm lg:text-base focus:outline-none focus:border-primary-light transition-colors resize-none"
          />
          <p className="text-xs lg:text-base text-gray-500 text-right mt-1">
            {form.schedule.length}/{MAX_SCHEDULE}
          </p>
        </div>

        {/* 모바일 전용 구분선 */}
        <div className="border-t border-gray-300 lg:hidden" />

        {/* ── 상세 일정 ── */}
        <div className="space-y-5 lg:space-y-[44px] lg:max-w-[500px]">
        <h2 className="text-xl font-bold text-gray-900 text-center lg:text-3xl lg:text-left lg:mb-2">상세 일정</h2>

        {/* 스터디 요일 */}
        <div className="flex items-start gap-4 lg:gap-[46px]">
          <span className="w-24 shrink-0 text-base lg:text-lg font-medium text-gray-700 pt-1 whitespace-nowrap">
            스터디 요일
          </span>
          <div className="flex flex-wrap gap-2">
            {DAYS.map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`w-[40px] h-[40px] rounded-full text-sm font-normal border transition-colors ${
                  form.days.includes(day)
                    ? "bg-primary text-background"
                    : "bg-background border-gray-300 text-gray-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* 스터디 시작일 */}
        <div className="flex items-center gap-4 lg:gap-[46px]">
          <span className="w-24 shrink-0 text-base lg:text-lg font-medium text-gray-700 whitespace-nowrap">
            스터디 시작일 <span className="text-error">*</span>
          </span>
          <div className="flex-1 lg:max-w-[240px]">
            <div ref={dateContainerRef} className="relative w-full">
              {/* 보이는 표시 — 클릭 시 showPicker() 호출 */}
              <div
                className={`w-full h-10 bg-background border rounded-lg pl-[14px] pr-[10px] text-base flex items-center justify-between cursor-pointer transition-colors ${isDateOpen ? "border-primary" : "border-gray-300"}`}
                onClick={() => {
                  setIsDateOpen(true);
                  (dateInputRef.current as HTMLInputElement & { showPicker?: () => void })?.showPicker?.();
                }}
              >
                <span className={form.startDate ? "text-gray-900" : "text-gray-500"}>
                  {form.startDate || "YYYY-MM-DD"}
                </span>
                <img src={iconCalendar} alt="" className="w-5 h-5 shrink-0" />
              </div>
              {/* 숨겨진 네이티브 피커 */}
              <input
                ref={dateInputRef}
                type="date"
                aria-label="시작 날짜 선택"
                value={form.startDate}
                onChange={(e) => { updateField("startDate", e.target.value); setIsDateOpen(false); }}
                className="absolute opacity-0 pointer-events-none w-0 h-0"
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-xs text-error">{errors.startDate}</p>
            )}
          </div>
        </div>

        {/* 스터디 기간 */}
        <div className="flex items-center gap-4 lg:gap-[46px]">
          <span className="w-24 shrink-0 text-base lg:text-lg font-medium text-gray-700 whitespace-nowrap">
            스터디 기간 <span className="text-error">*</span>
          </span>
          <div className="flex-1 lg:max-w-[240px]">
            <SelectPicker
              value={form.durationWeeks}
              onChange={(v) => updateField("durationWeeks", v)}
              options={DURATIONS}
              placeholder="스터디 기간 선택"
            />
            {errors.durationWeeks && (
              <p className="mt-1 text-xs text-error">{errors.durationWeeks}</p>
            )}
          </div>
        </div>

        {/* 스터디 시간 */}
        <div className="flex items-start gap-4 lg:gap-[46px]">
          <span className="w-24 shrink-0 text-base lg:text-lg font-medium text-gray-700 pt-2.5 whitespace-nowrap">
            스터디 시간 <span className="text-error">*</span>
          </span>
          <div className="flex-1 min-w-0 lg:max-w-[360px]">
            <div className="flex items-center gap-2">
              <TimePicker
                value={form.startTime}
                onChange={(v) => updateField("startTime", v)}
                className="w-[110px] flex-none"
              />
              <span className="text-gray-500 text-sm shrink-0">~</span>
              <TimePicker
                value={form.endTime}
                onChange={(v) => updateField("endTime", v)}
                className="w-[110px] flex-none"
              />
            </div>
            {errors.startTime && (
              <p className="mt-1 text-xs text-error">{errors.startTime}</p>
            )}
            {errors.endTime && (
              <p className="mt-1 text-xs text-error">{errors.endTime}</p>
            )}
            {errors.timeRange && (
              <p className="mt-1 text-xs text-error">{errors.timeRange}</p>
            )}
          </div>
        </div>
        </div>


        {/* 모바일 전용 구분선 */}
        <div className="border-t border-gray-300 lg:hidden" />

        {/* ── 스터디 태그 설정 ── */}
        <h2 className="text-xl font-bold text-gray-900 text-center lg:text-3xl lg:text-left lg:mb-2">스터디 태그 설정</h2>

        {/* 스터디 주제 */}
        <div className="lg:flex lg:items-start lg:gap-12">
          <label className="block text-base font-medium text-gray-700 mb-2 lg:shrink-0 lg:text-lg lg:font-bold lg:mb-0 lg:pt-[10px] lg:w-24 whitespace-nowrap">
            스터디 주제 <span className="text-error">*</span>
          </label>
          <div>
            <div className="flex flex-wrap gap-2">
              {SUBJECTS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => updateField("subject", s)}
                  className={`px-3 py-1.5 lg:px-4 lg:py-[10px] rounded-full text-base lg:text-lg font-normal border transition-colors ${
                    form.subject === s
                      ? "bg-primary text-background"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {errors.subject && (
              <p className="mt-1 text-xs text-error">{errors.subject}</p>
            )}
          </div>
        </div>

        {/* 스터디 난이도 */}
        <div className="lg:flex lg:items-start lg:gap-12">
          <label className="block text-base font-medium text-gray-700 mb-2 lg:shrink-0 lg:text-lg lg:font-bold lg:mb-0 lg:pt-[10px] lg:w-24 whitespace-nowrap">
            스터디 난이도 <span className="text-error">*</span>
          </label>
          <div>
            <div className="flex gap-2">
              {DIFFICULTIES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => updateField("difficulty", value)}
                  className={`px-3 py-1.5 lg:px-4 lg:py-[10px] rounded-full text-base lg:text-lg font-normal border transition-colors ${
                    form.difficulty === value
                      ? "bg-primary text-background"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {errors.difficulty && (
              <p className="mt-1 text-xs text-error">{errors.difficulty}</p>
            )}
          </div>
        </div>

        {/* 검색 태그 */}
        <div>
          <label className="block text-base font-medium text-gray-700 mb-2 lg:text-lg lg:font-bold">
            검색 태그 <span className="text-error">*</span>
            <span className="ml-1.5 text-xs text-gray-500 font-normal">
              ({form.tags.length}/{MAX_TAGS})
            </span>
          </label>
          <div className="relative">
            <div>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                onFocus={() => setIsTagFocused(true)}
                onBlur={() => setTimeout(() => setIsTagFocused(false), 200)}
                placeholder="태그 입력 (최대5개)"
                disabled={form.tags.length >= MAX_TAGS}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 lg:py-5 text-base focus:outline-none focus:border-primary-light transition-colors disabled:bg-gray-100 disabled:text-gray-300"
              />
            </div>
            {showTagDropdown && (
              <ul className="absolute z-10 left-0 right-0 mt-1 bg-background border border-gray-300 rounded-lg shadow-md max-h-48 overflow-y-auto">
                {filteredTagOptions.map((option) => (
                  <li
                    key={option}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleAddTagDirect(option);
                      (document.activeElement as HTMLElement)?.blur();
                    }}
                    className="px-3 py-2 text-sm font-regular text-gray-700 hover:bg-primary-light hover:text-background cursor-pointer transition-colors"
                  >
                    {option}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {form.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-100 text-gray-700 text-base rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="leading-none"
                    aria-label={`${tag} 삭제`}
                  >
                    <img src={iconBtnX} alt="" className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.tags && (
            <p className="mt-1.5 text-xs text-error">{errors.tags}</p>
          )}
        </div>
      </div>
    </form>
  );
}
