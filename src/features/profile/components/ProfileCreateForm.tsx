import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GitHubCalendar } from "react-github-calendar";
import useUpload from "@/hooks/useUpload";
import { getFullUrl } from "@/api/upload";
import {
  getProfile,
  updateProfile,
  checkNickname,
  getMemberType,
} from "@/api/profile";
import { getRegions, Region } from "@/api/auth";
import { storage } from "@/utils/storage";
import { useAuthStore } from "@/store/authStore";
import ImageIcon from "@/assets/base/icon-Image.svg?react";
import CheckIcon from "@/assets/base/icon-Check.svg?react";
import iconBtnX from "@/assets/base/icon-btn-X.svg";

const TAG_OPTIONS = [
  "Python",
  "JS",
  "Java",
  "React",
  "Django",
  "크롬확장프로그램",
  "사이드프로젝트",
  "알고리즘",
  "취업준비",
];
const MAX_BIO_LENGTH = 80;

type Tag = { id?: number; name: string };

const ProfileCreateForm = () => {
  const navigate = useNavigate();
  const { uploading, handleImageUpload } = useUpload();
  const { setIsAssociateMember } = useAuthStore();

  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [profileImgPath, setProfileImgPath] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [nickname, setNickname] = useState("");
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isTagFocused, setIsTagFocused] = useState(false);
  const [isRegionUnlocked, setIsRegionUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

  useEffect(() => {
    getRegions()
      .then((data) => setRegions(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = storage.getUserId();
      if (!userId) return;
      try {
        const data = await getProfile(userId);
        setNickname(data.nickname ?? "");
        setName(data.name ?? "");
        setPhone(data.phone ?? "");
        setBio(data.introduction ?? "");
        setGithub(data.github_username ?? "");
        setSelectedTags(data.tag ?? []);
        if (data.preferred_region) {
          setSelectedRegionId(data.preferred_region.id);
        }
        if (data.profile_img) {
          setProfileImg(getFullUrl(data.profile_img));
          setProfileImgPath(data.profile_img);
        }
        const emailFromStorage = storage.getEmail();
        if (emailFromStorage) setEmail(emailFromStorage);
        setIsNicknameChecked(true);
        setIsNicknameAvailable(true);
      } catch {
        setApiError("프로필을 불러오는 데 실패했어요.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const isNicknameValid = nickname.length >= 2;
  const isGithubValid = github === "" || /^[a-zA-Z0-9-]+$/.test(github);

  const filteredTagOptions = TAG_OPTIONS.filter(
    (t) =>
      !selectedTags.find((s) => s.name === t) &&
      (tagInput === "" || t.toLowerCase().includes(tagInput.toLowerCase())),
  );
  const showTagDropdown =
    isTagFocused && selectedTags.length < 5 && filteredTagOptions.length > 0;
  const isSaveEnabled =
    isNicknameValid &&
    isNicknameChecked &&
    isNicknameAvailable &&
    isGithubValid &&
    name !== "" &&
    phone !== "";

  const handleCheckNickname = async () => {
    const result = await checkNickname(nickname);
    setIsNicknameChecked(true);
    setIsNicknameAvailable(result.available);
    setNicknameMessage(result.message);
  };

  const removeTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((t) => t.name !== tagName));
  };

  const addCustomTag = () => {
    if (
      tagInput.trim() &&
      !selectedTags.find((t) => t.name === tagInput.trim())
    ) {
      setSelectedTags([...selectedTags, { name: tagInput.trim() }]);
      setTagInput("");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await handleImageUpload(file);
    if (url) {
      setProfileImgPath(url);
      setProfileImg(getFullUrl(url));
    }
  };

  const handleSave = async () => {
    const userId = storage.getUserId();
    if (!userId) return;
    setIsSaving(true);
    setApiError(null);
    try {
      await updateProfile(userId, {
        nickname,
        name,
        phone,
        introduction: bio,
        github_username: github,
        profile_img: profileImgPath ?? undefined,
        tag: selectedTags,
        preferred_region: selectedRegionId
          ? { id: selectedRegionId }
          : undefined,
      });
      try {
        const res = await getMemberType();
        setIsAssociateMember(res.is_associate_member);
      } catch {
        // 회원 타입 조회 실패는 저장 성공에 영향 없음
      }
      navigate("/profile");
    } catch {
      setApiError("저장에 실패했어요. 다시 시도해주세요.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-gray-500 text-sm">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[30px] w-full">
      {/* 프로필 생성 타이틀 */}
      <h1 className="text-3xl font-bold text-surface text-center leading-[40px]">
        프로필 생성
      </h1>

      <div className="flex flex-col border border-gray-300 rounded-[12px] bg-background">

        {/* 상단 - 프로필 사진 + 닉네임 + 소개 */}
        <div className="flex flex-col items-center border-b border-gray-300 py-[30px] px-[20px] md:px-[189px] gap-[30px]">
          <div className="flex flex-col items-center gap-[30px] w-full md:w-[612px]">

            {/* 프로필 이미지 */}
            <div className="relative w-[130px] h-[130px] shrink-0">
              <div className="w-[130px] h-[130px] rounded-full border border-gray-300 overflow-hidden">
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="프로필 이미지"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
              {/* 카메라 버튼 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 w-[38px] h-[38px] bg-background shadow-[2px_2px_8px_rgba(0,0,0,0.15)] rounded-full flex items-center justify-center"
              >
                <ImageIcon className="w-5 h-5 text-gray-500" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {/* 닉네임 */}
            <div className="flex flex-col gap-1 items-center w-full md:w-[400px]">
              <div className="relative w-full">
                <input
                  type="text"
                  value={nickname}
                  placeholder="닉네임"
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setIsNicknameChecked(false);
                    setIsNicknameAvailable(false);
                    setNicknameMessage(null);
                  }}
                  className="w-full border-b-2 border-primary py-2 text-base text-surface text-center bg-transparent focus:outline-none placeholder:text-gray-500"
                />
                <button
                  onClick={handleCheckNickname}
                  disabled={!isNicknameValid}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <CheckIcon
                    className={`w-5 h-5 ${isNicknameValid ? "text-gray-300" : "text-gray-300"}`}
                  />
                </button>
              </div>
              {nicknameMessage && (
                <p
                  className={`text-sm ${isNicknameAvailable ? "text-primary" : "text-error"}`}
                >
                  {nicknameMessage}
                </p>
              )}
            </div>

            {/* 소개 */}
            <div className="flex flex-col gap-[6px] w-full">
              <div className="relative w-full md:w-[600px]">
                <textarea
                  placeholder="소개를 입력해 주세요."
                  value={bio}
                  maxLength={MAX_BIO_LENGTH}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-gray-300 rounded-[8px] px-4 py-[14px] text-base text-surface placeholder:text-gray-500 resize-none h-[76px] focus:outline-none focus:border-primary"
                />
              </div>
              <p className="text-sm font-medium text-gray-700 text-right">
                {bio.length}/{MAX_BIO_LENGTH}
              </p>
            </div>
          </div>
        </div>

        {/* 하단 - 개인정보 폼 */}
        <div className="flex flex-col gap-[30px] px-[20px] md:px-[40px] py-[30px]">

          {/* 이메일(ID) */}
          <div className="flex items-center gap-[10px]">
            <span className="text-sm font-bold text-gray-700 w-[100px] shrink-0">
              이메일(ID)
            </span>
            <span className="text-base text-gray-700">{email}</span>
          </div>

          {/* 이름 */}
          <div className="flex items-center gap-[10px]">
            <label className="text-sm font-bold text-gray-700 w-[100px] shrink-0">
              이름 <span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-[10px]">
              <input
                type="text"
                placeholder="이름 입력"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full md:w-[382px] h-[40px] border border-gray-300 rounded-[8px] px-[14px] text-base text-surface placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="w-[120px] h-[40px] border border-gray-300 rounded-[8px] text-sm font-medium text-background bg-gray-300 shrink-0">
                중복 확인
              </button>
            </div>
          </div>

          {/* 전화번호 */}
          <div className="flex items-center gap-[10px]">
            <label className="text-sm font-bold text-gray-700 w-[100px] shrink-0">
              전화번호 <span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-[10px]">
              <input
                type="text"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full md:w-[382px] h-[40px] border border-gray-300 rounded-[8px] px-[14px] text-base text-surface placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="w-[120px] h-[40px] border border-gray-300 rounded-[8px] text-sm font-medium text-surface bg-background shrink-0">
                인증
              </button>
            </div>
          </div>

          {/* 내 지역 */}
          <div className="flex items-center gap-[10px]">
            <label className="text-sm font-bold text-gray-700 w-[100px] shrink-0">
              내 지역
            </label>
            <div className="flex items-center gap-[10px]">
              {isRegionUnlocked ? (
                <select
                  value={selectedRegionId ?? ""}
                  onChange={(e) =>
                    setSelectedRegionId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className="w-full md:w-[382px] h-[40px] border border-gray-300 rounded-[8px] px-[14px] text-base text-surface focus:outline-none focus:border-primary bg-background"
                >
                  <option value="">지역 선택</option>
                  {regions
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((region) => (
                      <option key={region.id} value={region.id}>
                        {region.location}
                      </option>
                    ))}
                </select>
              ) : (
                <div className="w-full md:w-[382px] h-[40px] border border-gray-300 rounded-[8px] bg-gray-100" />
              )}
              <button
                type="button"
                onClick={() => setIsRegionUnlocked(true)}
                className="w-[120px] h-[40px] border border-gray-300 rounded-[8px] text-sm font-medium text-surface bg-background shrink-0"
              >
                인증
              </button>
            </div>
          </div>

          {/* GitHub */}
          <div className="flex items-start gap-[10px]">
            <label className="text-sm font-bold text-gray-700 w-[100px] shrink-0 pt-[10px]">
              GitHub<br />User Name
            </label>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-[10px]">
                <input
                  type="text"
                  placeholder="GitHub 아이디"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className={`w-full md:w-[382px] h-[40px] border rounded-[8px] px-[14px] text-base text-surface placeholder:text-gray-500 focus:outline-none ${
                    github && !isGithubValid
                      ? "border-error"
                      : "border-gray-300 focus:border-primary"
                  }`}
                />
                <button className="w-[120px] h-[40px] border border-gray-300 rounded-[8px] text-sm font-medium text-background bg-gray-300 shrink-0">
                  {github ? "연동 해제" : "잔디 연동"}
                </button>
              </div>
              {github && !isGithubValid && (
                <p className="text-xs text-error">
                  영문, 숫자, 하이픈(-)만 입력 가능해요!
                </p>
              )}
              {github && isGithubValid && (
                <div className="w-full h-[160px] border border-gray-300 rounded-[10px] bg-background px-5 flex items-center">
                  <GitHubCalendar
                    username={github}
                    blockSize={13}
                    blockMargin={2}
                    fontSize={10}
                    colorScheme="light"
                  />
                </div>
              )}
            </div>
          </div>

          {/* 관심 분야 태그 */}
          <div className="flex flex-col gap-[10px]">
            <label className="text-sm font-bold text-gray-700">
              관심 분야 태그
            </label>
            <div className="relative">
              {/* 태그 + 입력창 박스 */}
              <div className="w-full min-h-[40px] border border-gray-300 rounded-[8px] px-[14px] py-[6px] flex flex-wrap gap-2 items-center focus-within:border-primary transition-colors">
                {selectedTags.map((tag, index) => (
                  <span
                    key={tag.id ?? `new-${index}`}
                    className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-100 text-gray-700 text-base rounded-full"
                  >
                    {tag.name}
                    <button
                      type="button"
                      onClick={() => removeTag(tag.name)}
                      className="leading-none"
                    >
                      <img src={iconBtnX} alt="" className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustomTag()}
                  onFocus={() => setIsTagFocused(true)}
                  onBlur={() => setTimeout(() => setIsTagFocused(false), 200)}
                  placeholder={selectedTags.length >= 5 ? "" : "태그 입력 (최대 5개)"}
                  disabled={selectedTags.length >= 5}
                  className="flex-1 min-w-[120px] text-base text-surface placeholder:text-gray-500 focus:outline-none bg-transparent disabled:placeholder:text-gray-300"
                />
              </div>
              {/* 드롭다운 */}
              {showTagDropdown && (
                <ul className="absolute z-50 left-0 right-0 mt-1 bg-background border border-gray-300 rounded-[8px] shadow-md max-h-48 overflow-y-auto">
                  {filteredTagOptions.map((option) => (
                    <li
                      key={option}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setSelectedTags([...selectedTags, { name: option }]);
                        setTagInput("");
                      }}
                      className="px-3 py-2 text-sm text-gray-700 hover:bg-primary-light hover:text-background cursor-pointer transition-colors"
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {apiError && <p className="text-sm text-error text-center">{apiError}</p>}

      {/* 저장 버튼 */}
      <div className="flex flex-col items-center gap-[30px]">
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled || isSaving}
          className={`w-[250px] h-[50px] rounded-[8px] text-base font-medium ${
            isSaveEnabled && !isSaving
              ? "bg-primary text-background"
              : "bg-gray-300 text-background cursor-not-allowed"
          }`}
        >
          {isSaving ? "저장 중..." : "시작하기"}
        </button>
      </div>
    </div>
  );
};

export default ProfileCreateForm;
