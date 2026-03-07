import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StudyForm from "@/features/study/components/StudyForm";
import StudyCreateTopBar from "@/features/study/components/StudyCreateTopBar";
import { useStudyForm } from "@/features/study/hooks/useStudyForm";
import { useAiStream } from "@/features/study/hooks/useAiStream";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { StudyFormState } from "@/types/study";
import { createStudy } from "@/api/study";
import useUpload from "@/hooks/useUpload";
import { getFullUrl } from "@/api/upload";
import { getProfile, getMemberType } from "@/api/profile";
import { storage } from "@/utils/storage";

export default function StudyCreate() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { uploading, handleImageUpload } = useUpload();
  const [userLocationId, setUserLocationId] = useState<number | undefined>(undefined);
  const [userLocation, setUserLocation] = useState<string | undefined>(undefined);
  const [isMemberChecking, setIsMemberChecking] = useState(true);

  useEffect(() => {
    const userId = storage.getUserId();
    if (!userId) {
      navigate("/login", { replace: true });
      return;
    }

    getMemberType()
      .then(({ is_associate_member }) => {
        if (!is_associate_member) {
          // 준회원 → 프로필 설정 페이지로 이동
          navigate("/profile/edit", { replace: true });
          return;
        }
        // 정회원 → 지역 정보 불러오기
        return getProfile(userId).then((profile) => {
          if (profile.preferred_region) {
            setUserLocationId(profile.preferred_region.id);
            setUserLocation(profile.preferred_region.location);
          }
          setIsMemberChecking(false);
        });
      })
      .catch(() => {
        // 조회 실패 시 그대로 진행
        setIsMemberChecking(false);
      });
  }, [navigate]);

  const handleSubmit = useCallback(async (formState: StudyFormState) => {
    if (isSubmitting || uploading) return;
    setIsSubmitting(true);
    setApiError(null);

    if (formState.studyType === "offline" && !userLocationId) {
      setApiError("오프라인 스터디 생성을 위해 프로필에서 지역을 먼저 설정해주세요.");
      setIsSubmitting(false);
      return;
    }

    try {
      const url = await handleImageUpload(formState.thumbnail!);
      if (!url) {
        setApiError("썸네일 업로드에 실패했습니다. 다시 시도해주세요.");
        return;
      }
      const thumbnailUrl = getFullUrl(url);
      const { id } = await createStudy(formState, thumbnailUrl, userLocationId);
      navigate(`/study/${id}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMsg: string | undefined =
          error.response?.data?.detail ?? error.response?.data?.validationError;
        if (status === 401) {
          setApiError("로그인이 필요합니다.");
        } else if (status === 403) {
          setApiError(serverMsg ?? "정회원만 스터디를 생성할 수 있습니다.");
        } else if (status === 400 || status === 404) {
          setApiError(serverMsg ?? "입력 정보를 다시 확인해주세요.");
        } else {
          setApiError("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } else {
        setApiError("네트워크 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, uploading, navigate, handleImageUpload, userLocationId]);

  const {
    form,
    errors,
    tagInput,
    setTagInput,
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
    handleSubmit: onSubmit,
    handleReset,
  } = useStudyForm(handleSubmit);

  const { isLoading: aiIsLoading, trigger } = useAiStream((field, text) => {
    updateField(field, text);
  });

  if (isMemberChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ── 앱 헤더 (모바일/데스크탑 공통) ── */}
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      {/* ── 스터디 만들기 TopBar ── */}
      <StudyCreateTopBar isValid={isValid} isSubmitting={isSubmitting || uploading} />

      {/* ── 폼 ── */}
      <main className="max-w-[1200px] mx-auto pb-10">
        {apiError && (
          <div className="mx-4 mt-4 p-3 bg-error-light border border-error-border rounded-lg text-sm text-error">
            {apiError}
          </div>
        )}
        <StudyForm
          form={form}
          errors={errors}
          tagInput={tagInput}
          isValid={isValid}
          fileInputRef={fileInputRef}
          setTagInput={setTagInput}
          updateField={updateField}
          handleThumbnailChange={handleThumbnailChange}
          handleDayToggle={handleDayToggle}
          handleAddTag={handleAddTag}
          handleAddTagDirect={handleAddTagDirect}
          handleRemoveTag={handleRemoveTag}
          handleTagInputKeyDown={handleTagInputKeyDown}
          handleBlurField={handleBlurField}
          handleSubmit={onSubmit}
          handleReset={handleReset}
          userLocation={userLocation}
          onAiGenerate={() => trigger({
            title: form.title,
            subject: form.subject,
            difficulty: form.difficulty,
            durationWeeks: form.durationWeeks,
            days: form.days,
          }, form.schedule)}
          aiIsLoading={aiIsLoading}
        />
      </main>

      <Footer />
    </div>
  );
}
