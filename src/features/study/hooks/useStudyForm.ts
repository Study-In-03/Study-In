import { useState, useCallback, useRef, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent, FormEvent } from "react";
import type { StudyFormState, StudyFormErrors, StudyDay } from "@/types/study";

const INITIAL_STATE: StudyFormState = {
  thumbnail: null,
  thumbnailPreview: "",
  title: "",
  studyType: "",
  location: "",
  maxMembers: "",
  introduction: "",
  schedule: "",
  leaderIntro: "",
  days: [],
  startDate: "",
  durationWeeks: "",
  startTime: "",
  endTime: "",
  subject: "",
  difficulty: "",
  tags: [],
};

function validateForm(state: StudyFormState, minMembers?: number): StudyFormErrors {
  const errors: StudyFormErrors = {};

  if (!state.thumbnail && !state.thumbnailPreview) errors.thumbnail = "썸네일 이미지를 업로드해주세요.";
  if (!state.title.trim()) errors.title = "스터디 제목을 입력해주세요.";
  if (!state.studyType) errors.studyType = "스터디 유형을 선택해주세요.";
  if (state.maxMembers === "") {
    errors.maxMembers = "모집 인원을 입력해주세요.";
  } else if (Number(state.maxMembers) < 3) {
    errors.maxMembers = "스터디원은 3명 이상 모집해야 합니다.";
  } else if (Number(state.maxMembers) >= 100) {
    errors.maxMembers = "100명 이상 모집할 수 없습니다.";
  } else if (minMembers != null && Number(state.maxMembers) < minMembers) {
    errors.maxMembers = `현재 참가 인원(${minMembers}명) 이상으로 설정해야 합니다.`;
  }
  if (!state.startDate) errors.startDate = "시작일을 선택해주세요.";
  if (state.durationWeeks === "") errors.durationWeeks = "기간을 입력해주세요.";
  if (!state.startTime) errors.startTime = "시작 시간을 선택해주세요.";
  if (!state.endTime) errors.endTime = "종료 시간을 선택해주세요.";
  if (state.startTime && state.endTime && state.startTime >= state.endTime) {
    errors.timeRange = "종료 시간은 시작 시간보다 늦어야 합니다.";
  }
  if (!state.subject) errors.subject = "주제를 선택해주세요.";
  if (!state.difficulty) errors.difficulty = "난이도를 선택해주세요.";
  if (state.tags.length === 0) errors.tags = "태그를 1개 이상 입력해주세요.";

  return errors;
}

function isFormValid(state: StudyFormState, minMembers?: number): boolean {
  if (!state.thumbnail && !state.thumbnailPreview) return false;
  if (!state.title.trim()) return false;
  if (!state.studyType) return false;
  if (
    state.maxMembers === "" ||
    Number(state.maxMembers) < 3 ||
    Number(state.maxMembers) > 99 ||
    (minMembers != null && Number(state.maxMembers) < minMembers)
  )
    return false;
  if (!state.startDate) return false;
  if (state.durationWeeks === "") return false;
  if (!state.startTime) return false;
  if (!state.endTime) return false;
  if (state.startTime >= state.endTime) return false;
  if (!state.subject) return false;
  if (!state.difficulty) return false;
  if (state.tags.length === 0) return false;
  return true;
}

export function useStudyForm(
  onSubmit?: (state: StudyFormState) => void,
  initialValues?: StudyFormState,
  minMembers?: number,
) {
  const [form, setForm] = useState<StudyFormState>(initialValues ?? INITIAL_STATE);
  const [errors, setErrors] = useState<StudyFormErrors>({});
  const [tagInput, setTagInput] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 항상 최신 form 값을 참조하기 위한 ref (useCallback 클로저 문제 방지)
  const formRef = useRef(form);
  useEffect(() => { formRef.current = form; }, [form]);

  const updateField = useCallback(
    <K extends keyof StudyFormState>(key: K, value: StudyFormState[K]) => {
      setForm((prev: StudyFormState) => ({ ...prev, [key]: value }));
      setIsDirty(true);
      setErrors((prev: StudyFormErrors) => {
        const next = { ...prev };
        if (key === "maxMembers") {
          const num = Number(value);
          if ((value as string) === "") {
            next.maxMembers = "모집 인원을 입력해주세요.";
          } else if (num < 3) {
            next.maxMembers = "스터디원은 3명 이상 모집해야 합니다.";
          } else if (num >= 100) {
            next.maxMembers = "100명 이상 모집할 수 없습니다.";
          } else {
            delete next.maxMembers;
          }
        } else if (key === "startTime" || key === "endTime") {
          delete next.startTime;
          delete next.endTime;
          delete next.timeRange;
          const newStart = key === "startTime" ? (value as string) : formRef.current.startTime;
          const newEnd   = key === "endTime"   ? (value as string) : formRef.current.endTime;
          if (newStart && newEnd && newStart >= newEnd) {
            next.timeRange = "종료 시간은 시작 시간보다 늦어야 합니다.";
          }
        } else if (prev[key as keyof StudyFormErrors]) {
          delete next[key as keyof StudyFormErrors];
        }
        return next;
      });
    },
    [],
  );

  // blur 시 필수 필드 검증
  const handleBlurField = useCallback((key: keyof StudyFormState) => {
    const current = formRef.current;
    setErrors((prev) => {
      const next = { ...prev };
      if (key === "title" && !current.title.trim()) {
        next.title = "스터디 제목을 입력해주세요.";
      } else if (key === "maxMembers") {
        const num = Number(current.maxMembers);
        if (current.maxMembers === "") {
          next.maxMembers = "모집 인원을 입력해주세요.";
        } else if (num < 3) {
          next.maxMembers = "스터디원은 3명 이상 모집해야 합니다.";
        } else if (num >= 100) {
          next.maxMembers = "100명 이상 모집할 수 없습니다.";
        }
      }
      return next;
    });
  }, []);

  const handleThumbnailChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const allowed = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/bmp",
        "image/tiff",
        "image/webp",
        "image/x-icon",
      ];
      if (!allowed.includes(file.type)) {
        setErrors((prev: StudyFormErrors) => ({
          ...prev,
          thumbnail: "지원하지 않는 이미지 형식입니다.",
        }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev: StudyFormErrors) => ({
          ...prev,
          thumbnail: "이미지는 5MB 이하여야 합니다.",
        }));
        return;
      }

      const preview = URL.createObjectURL(file);
      setForm((prev: StudyFormState) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: preview,
      }));
      setErrors((prev: StudyFormErrors) => {
        const next = { ...prev };
        delete next.thumbnail;
        return next;
      });
      setIsDirty(true);
      e.target.value = "";
    },
    [],
  );

  const handleDayToggle = useCallback((day: StudyDay) => {
    setForm((prev: StudyFormState) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d: StudyDay) => d !== day)
        : [...prev.days, day],
    }));
    setIsDirty(true);
  }, []);

  const handleAddTag = useCallback(() => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (form.tags.includes(trimmed)) return;
    if (form.tags.length >= 5) return;
    setForm((prev: StudyFormState) => ({
      ...prev,
      tags: [...prev.tags, trimmed],
    }));
    setTagInput("");
    setErrors((prev: StudyFormErrors) => {
      const next = { ...prev };
      delete next.tags;
      return next;
    });
    setIsDirty(true);
  }, [tagInput, form.tags]);

  const handleAddTagDirect = useCallback((tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (form.tags.includes(trimmed)) return;
    if (form.tags.length >= 5) return;
    setForm((prev: StudyFormState) => ({
      ...prev,
      tags: [...prev.tags, trimmed],
    }));
    setTagInput("");
    setErrors((prev: StudyFormErrors) => {
      const next = { ...prev };
      delete next.tags;
      return next;
    });
    setIsDirty(true);
  }, [form.tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setForm((prev: StudyFormState) => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag),
    }));
    setIsDirty(true);
  }, []);

  const handleTagInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        
        const trimmed = tagInput.trim();
        if (!trimmed || form.tags.includes(trimmed) || form.tags.length >= 5) {
          setTagInput("");
          return;
        }

        setForm((prev: StudyFormState) => ({
          ...prev,
          tags: [...prev.tags, trimmed],
        }));
        
        setTagInput("");
        setErrors((prev: StudyFormErrors) => {
          const next = { ...prev };
          delete next.tags;
          return next;
        });
        setIsDirty(true);
      }
    },
    [tagInput, form.tags]
  ); 

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const validationErrors = validateForm(form, minMembers);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      onSubmit?.(form);
    },
    [form, onSubmit]
  );

  const handleReset = useCallback(() => {
    setForm(INITIAL_STATE);
    setErrors({});
    setTagInput("");
    setIsDirty(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const isValid = isFormValid(form, minMembers);

  return {
    form,
    errors,
    tagInput,
    setTagInput,
    isDirty,
    isValid,
    fileInputRef,
    updateField,
    handleThumbnailChange,
    handleDayToggle,
    handleAddTag,
    handleAddTagDirect,
    handleRemoveTag,
    handleTagInputKeyDown,
    handleBlurField,
    handleSubmit,
    handleReset,
  };
}