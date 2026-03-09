import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import StudyForm from "@/features/study/components/StudyForm";
import StudyCreateTopBar from "@/features/study/components/StudyCreateTopBar";
import { useStudyForm } from "@/features/study/hooks/useStudyForm";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import type { StudyFormState } from "@/types/study";
import type { StudyDay } from "@/types/study";
import { getStudy, updateStudy, deleteStudy } from "@/api/study";
import { useAiStream } from "@/features/study/hooks/useAiStream";
import type { StudyApiData } from "@/api/study";
import useUpload from "@/hooks/useUpload";
import { getFullUrl } from "@/api/upload";
import { getProfile } from "@/api/profile";
import { storage } from "@/utils/storage";

const DIFFICULTY_REVERSE: Record<string, string> = {
  초급: "beginner",
  중급: "intermediate",
  고급: "advanced",
};

const SUBJECT_REVERSE: Record<string, string> = {
  개념학습: "개념/학습",
  "응용/활용": "응용/활용",
  프로젝트: "프로젝트",
  챌린지: "챌린지",
  "자격증/시험": "자격증/시험",
  "취업/코테": "취업/코테",
  특강: "특강",
  기타: "기타",
};

function mapStudyApiToForm(data: StudyApiData): StudyFormState {
  return {
    thumbnail: null,
    thumbnailPreview: data.thumbnail,
    title: data.title,
    studyType: data.is_offline ? "offline" : "online",
    location: data.study_location?.location ?? "",
    maxMembers: String(data.recruitment),
    introduction: data.study_info,
    schedule: data.schedule_info ?? "",
    leaderIntro: data.leader_intro ?? "",
    days: data.study_day.map((d) => d.name as StudyDay),
    startDate: data.start_date,
    durationWeeks: String(data.term),
    startTime: data.start_time.slice(0, 5),
    endTime: data.end_time.slice(0, 5),
    subject: SUBJECT_REVERSE[data.subject.name] ?? data.subject.name,
    difficulty: DIFFICULTY_REVERSE[data.difficulty.name] ?? "",
    tags: data.search_tag.map((t) => t.name),
  };
}

interface StudyEditInnerProps {
  studyId: number;
  initialValues: StudyFormState;
  currentParticipants: number;
  locationId?: number;
  profileLocationId?: number;
  profileLocation?: string;
  existingThumbnailUrl: string;
}

function StudyEditInner({
  studyId,
  initialValues,
  currentParticipants,
  locationId,
  profileLocationId,
  profileLocation,
  existingThumbnailUrl,
}: StudyEditInnerProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { uploading, handleImageUpload } = useUpload();

  const handleSubmit = useCallback(
    async (formState: StudyFormState) => {
      if (isSubmitting || uploading) return;
      setIsSubmitting(true);
      setApiError(null);

      const effectiveLocationId = locationId ?? profileLocationId;
      if (formState.studyType === "offline" && !effectiveLocationId) {
        setApiError("오프라인 스터디 수정을 위해 프로필에서 지역을 먼저 설정해주세요.");
        setIsSubmitting(false);
        return;
      }

      try {
        let thumbnailUrl: string;
        if (formState.thumbnail) {
          const url = await handleImageUpload(formState.thumbnail);
          if (!url) {
            setApiError("썸네일 업로드에 실패했습니다. 다시 시도해주세요.");
            return;
          }
          thumbnailUrl = getFullUrl(url);
        } else {
          thumbnailUrl = existingThumbnailUrl;
        }
        await updateStudy(studyId, formState, thumbnailUrl, effectiveLocationId);
        navigate(`/study/${studyId}`);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const status = error.response?.status;
          const serverMsg: string | undefined =
            error.response?.data?.detail ?? error.response?.data?.validationError;
          if (status === 401) {
            setApiError("로그인이 필요합니다.");
          } else if (status === 403) {
            setApiError(serverMsg ?? "수정 권한이 없습니다.");
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
    },
    [isSubmitting, uploading, navigate, handleImageUpload, studyId, locationId, profileLocationId, existingThumbnailUrl],
  );

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteStudy(studyId);
      navigate("/my-study");
    } catch (error) {
      setIsDeleting(false);
      setShowDeleteModal(false);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMsg: string | undefined = error.response?.data?.detail;
        if (status === 401) {
          setApiError("로그인이 필요합니다.");
        } else if (status === 403) {
          setApiError(serverMsg ?? "삭제 권한이 없습니다.");
        } else if (status === 404) {
          setApiError(serverMsg ?? "스터디를 찾을 수 없습니다.");
        } else {
          setApiError("삭제 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      } else {
        setApiError("네트워크 오류가 발생했습니다.");
      }
    }
  };

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
  } = useStudyForm(handleSubmit, initialValues, currentParticipants);

  const { isLoading: aiIsLoading, trigger } = useAiStream((field, text) => {
    updateField(field, text);
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10">
        <Header />
      </div>

      <StudyCreateTopBar
        isValid={isValid}
        isSubmitting={isSubmitting || uploading}
        submitLabel="저장하기"
        submittingLabel="저장 중..."
        onViewStudy={() => navigate(`/study/${studyId}`)}
        onDeleteStudy={() => setShowDeleteModal(true)}
      />

      <main className="mx-auto max-w-[1190px] pb-10">
        {apiError && (
          <div className="mx-4 mt-4 rounded-lg border border-error-border bg-error-light p-3 text-sm text-error">
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
          userLocation={initialValues.location || profileLocation}
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

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-sm rounded-2xl bg-background p-6 shadow-xl">
            <h2 className="text-lg font-bold">스터디 삭제</h2>
            <p className="mt-2 text-sm text-gray-700">
              정말 이 스터디를 삭제하시겠습니까?
              <br />이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 rounded-xl border border-gray-300 py-2 text-sm font-medium transition hover:bg-gray-100 disabled:opacity-50"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 rounded-xl bg-error py-2 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-50"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StudyEdit() {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<StudyFormState | null>(null);
  const [currentParticipants, setCurrentParticipants] = useState(0);
  const [locationId, setLocationId] = useState<number | undefined>(undefined);
  const [profileLocationId, setProfileLocationId] = useState<number | undefined>(undefined);
  const [profileLocation, setProfileLocation] = useState<string | undefined>(undefined);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (!studyId) return;
    const userId = storage.getUserId();
    const fetchProfile = userId
      ? getProfile(userId).catch(() => null)
      : Promise.resolve(null);

    Promise.all([getStudy(Number(studyId)), fetchProfile])
      .then(([data, profile]) => {
        setInitialValues(mapStudyApiToForm(data));
        setCurrentParticipants(data.participants.length);
        setLocationId(data.study_location?.id);
        setExistingThumbnailUrl(data.thumbnail);
        if (profile?.preferred_region) {
          setProfileLocationId(profile.preferred_region.id);
          setProfileLocation(profile.preferred_region.location);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setFetchError("스터디 정보를 불러오지 못했습니다.");
        setIsLoading(false);
      });
  }, [studyId]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">불러오는 중...</p>
      </div>
    );
  }

  if (fetchError || !initialValues) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm text-gray-500">{fetchError ?? "알 수 없는 오류가 발생했습니다."}</p>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-xl border border-gray-300 px-4 py-2 text-sm"
        >
          뒤로가기
        </button>
      </div>
    );
  }

  return (
    <StudyEditInner
      studyId={Number(studyId)}
      initialValues={initialValues}
      currentParticipants={currentParticipants}
      locationId={locationId}
      profileLocationId={profileLocationId}
      profileLocation={profileLocation}
      existingThumbnailUrl={existingThumbnailUrl}
    />
  );
}
