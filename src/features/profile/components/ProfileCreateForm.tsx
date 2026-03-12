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
import CheckFillIcon from "@/assets/base/icon-Check-fill.svg?react";
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
  const [isNicknameFocused, setIsNicknameFocused] = useState(false);
  const [isNicknameTouched, setIsNicknameTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isTagFocused, setIsTagFocused] = useState(false);
  const [isRegionUnlocked, setIsRegionUnlocked] = useState(false);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isGithubLinked, setIsGithubLinked] = useState(false);
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

  // 닉네임 입력 시 500ms debounce 자동 중복 체크
  useEffect(() => {
    if (!isNicknameValid) return;
    const timer = setTimeout(async () => {
      const result = await checkNickname(nickname);
      setIsNicknameChecked(true);
      setIsNicknameAvailable(result.available);
      setNicknameMessage(result.message);
    }, 500);
    return () => clearTimeout(timer);
  }, [nickname, isNicknameValid]);

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
                  placeholder="별명을 입력해 주세요."
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setIsNicknameChecked(false);
                    setIsNicknameAvailable(false);
                    setNicknameMessage(null);
                  }}
                  onFocus={() => setIsNicknameFocused(true)}
                  onBlur={() => { setIsNicknameFocused(false); setIsNicknameTouched(true); }}
                  className={`w-full border-b-2 ${
                    (isNicknameTouched && !nickname) || (isNicknameChecked && !isNicknameAvailable)
                      ? 'border-error'
                      : isNicknameFocused
                        ? 'border-primary'
                        : 'border-gray-300'
                  } py-2 text-base text-surface text-center bg-transparent focus:outline-none placeholder:text-gray-500`}
                />
                <button
                  onClick={handleCheckNickname}
                  disabled={!isNicknameValid}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  {isNicknameAvailable ? (
                    <CheckFillIcon className="w-5 h-5 text-primary" />
                  ) : (
                    <CheckIcon className="w-5 h-5 text-gray-300" />
                  )}
                </button>
              </div>
              {isNicknameTouched && !nickname ? (
                <p className="text-sm text-error">*별명은 필수 입력 항목입니다.</p>
              ) : nicknameMessage ? (
                <p className={`text-sm ${isNicknameAvailable ? "text-primary" : "text-error"}`}>
                  {isNicknameAvailable ? nicknameMessage : `*${nicknameMessage}`}
                </p>
              ) : null}
            </div>

            {/* 소개 */}
            <div className="flex flex-col gap-[6px] w-full">
              <div className="flex flex-col gap-[6px] w-full md:w-[600px]">
                <textarea
                  placeholder="소개를 입력해 주세요."
                  value={bio}
                  maxLength={MAX_BIO_LENGTH}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full border border-gray-300 rounded-[8px] px-4 py-[14px] text-base text-surface placeholder:text-gray-500 resize-none h-[148px] md:h-[76px] focus:outline-none focus:border-primary"
                />
                <p className="md:hidden text-sm font-medium text-gray-700 text-right">
                  {bio.length}/{MAX_BIO_LENGTH}
                </p>
                <p className="hidden md:block text-sm font-medium text-gray-700 text-right">
                  {bio.length}/{MAX_BIO_LENGTH}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 - 개인정보 폼 */}
        <div className="flex flex-col gap-[30px] px-[20px] md:px-[40px] py-[30px]">

          {/* 이메일(ID) */}
          <div className="flex items-center gap-[20px] md:gap-[10px]">
            <span className="text-sm font-bold text-gray-700 md:w-[100px] md:shrink-0">
              이메일(ID)
            </span>
            <span className="text-base text-gray-700">{email}</span>
          </div>

          {/* 이름 */}
          <div className="flex flex-col gap-[4px] md:flex-row md:items-center md:gap-[10px]">
            <label className="text-sm font-bold text-gray-700 md:w-[100px] md:shrink-0">
              이름 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full md:w-[282px] h-[40px] border border-gray-300 rounded-[8px] px-[14px] text-base text-surface placeholder:text-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          {/* 전화번호 */}
          <div className="flex flex-col gap-[4px] md:flex-row md:items-center md:gap-[10px]">
            <label className="text-sm font-bold text-gray-700 md:w-[100px] md:shrink-0">
              전화번호 <span className="text-error">*</span>
            </label>
            <div className="flex items-center gap-[10px]">
              <input
                type="text"
                inputMode="numeric"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
                  let formatted = digits;
                  if (digits.length > 7) formatted = `${digits.slice(0,3)}-${digits.slice(3,7)}-${digits.slice(7)}`;
                  else if (digits.length > 3) formatted = `${digits.slice(0,3)}-${digits.slice(3)}`;
                  setPhone(formatted);
                }}
                className="flex-1 md:flex-none md:w-[282px] h-[40px] border border-gray-300 rounded-[8px] px-[14px] text-base text-surface placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button
                type="button"
                disabled={!phone}
                className={`w-[100px] md:w-[120px] h-[40px] border rounded-[8px] text-sm font-medium text-background shrink-0 transition-colors ${
                  phone
                    ? "bg-primary border-primary cursor-pointer"
                    : "bg-gray-300 border-gray-300 cursor-not-allowed"
                }`}
              >
                인증
              </button>
            </div>
          </div>

          {/* 내 지역 */}
          <div className="flex flex-col gap-[4px] md:flex-row md:items-center md:gap-[10px]">
            <label className="text-sm font-bold text-gray-700 md:w-[100px] md:shrink-0">
              내 지역
            </label>
            <div className="flex items-center gap-[10px]">
              {/* 모바일 커스텀 드롭다운 */}
              <div className="relative flex-1 md:hidden">
                {isRegionUnlocked ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsRegionDropdownOpen((v) => !v)}
                      className="w-full h-[40px] border border-gray-300 rounded-[8px] px-[14px] text-base text-surface bg-background flex items-center justify-between focus:outline-none focus:border-primary"
                    >
                      <span className={selectedRegionId ? "text-surface" : "text-gray-500"}>
                        {selectedRegionId
                          ? regions.find((r) => r.id === selectedRegionId)?.location
                          : "지역 선택"}
                      </span>
                      <svg className={`w-4 h-4 text-gray-500 transition-transform ${isRegionDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {isRegionDropdownOpen && (
                      <ul className="absolute z-50 left-0 right-0 mt-1 bg-background border border-gray-300 rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto">
                        <li
                          onMouseDown={() => { setSelectedRegionId(null); setIsRegionDropdownOpen(false); }}
                          className="px-[14px] py-[12px] text-base text-gray-500"
                        >
                          지역 선택
                        </li>
                        {regions
                          .sort((a, b) => a.sort_order - b.sort_order)
                          .map((region) => (
                            <li
                              key={region.id}
                              onMouseDown={() => { setSelectedRegionId(region.id); setIsRegionDropdownOpen(false); }}
                              className={`px-[14px] py-[12px] text-base cursor-pointer hover:bg-gray-100 ${selectedRegionId === region.id ? "text-primary font-medium" : "text-surface"}`}
                            >
                              {region.location}
                            </li>
                          ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <div className="w-full h-[40px] border border-gray-300 rounded-[8px] bg-gray-100" />
                )}
              </div>
              {/* 데스크탑 네이티브 select */}
              {isRegionUnlocked ? (
                <select
                  value={selectedRegionId ?? ""}
                  onChange={(e) =>
                    setSelectedRegionId(
                      e.target.value ? Number(e.target.value) : null,
                    )
                  }
                  className="hidden md:block md:flex-none md:w-[282px] h-[40px] border border-gray-300 rounded-[8px] px-[14px] text-base text-surface focus:outline-none focus:border-primary bg-background"
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
                <div className="hidden md:block md:flex-none md:w-[282px] h-[40px] border border-gray-300 rounded-[8px] bg-gray-100" />
              )}
              <button
                type="button"
                onClick={() => setIsRegionUnlocked(true)}
                className="w-[100px] md:w-[120px] h-[40px] border border-gray-300 rounded-[8px] text-sm font-medium text-surface bg-background shrink-0"
              >
                인증
              </button>
            </div>
          </div>

          {/* GitHub */}
          <div className="flex flex-col gap-[4px] md:flex-row md:items-start md:gap-[10px]">
            <label className="text-sm font-bold text-gray-700 md:w-[100px] md:shrink-0 md:pt-[10px]">
              GitHub<br className="hidden md:block" /> User Name
            </label>
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <div className="flex items-center gap-[10px]">
                <input
                  type="text"
                  placeholder="GitHub 아이디"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className={`flex-1 md:flex-none md:w-[282px] h-[40px] border rounded-[8px] px-[14px] text-base text-surface placeholder:text-gray-500 focus:outline-none ${
                    github && !isGithubValid
                      ? "border-error"
                      : "border-gray-300 focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (isGithubLinked) {
                      setIsGithubLinked(false);
                    } else if (github && isGithubValid) {
                      setIsGithubLinked(true);
                    }
                  }}
                  className={`w-[100px] md:w-[120px] h-[40px] border rounded-[8px] text-sm font-medium shrink-0 ${
                    isGithubLinked
                      ? "border-gray-300 text-background bg-gray-300"
                      : github && isGithubValid
                        ? "border-primary bg-primary text-background cursor-pointer"
                        : "border-gray-300 text-background bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isGithubLinked ? "연동 해제" : "잔디 연동"}
                </button>
              </div>
              {github && !isGithubValid && (
                <p className="text-xs text-error">
                  영문, 숫자, 하이픈(-)만 입력 가능해요!
                </p>
              )}
              {isGithubLinked && github && isGithubValid && (
                <div className="border border-gray-300 rounded-[10px] bg-background flex items-center
                  w-full h-[100px] px-3 md:w-full md:h-[160px] md:px-5 overflow-hidden">
                  {/* 모바일 */}
                  <div className="md:hidden w-full overflow-hidden">
                    <GitHubCalendar
                      username={github}
                      blockSize={5}
                      blockMargin={1}
                      fontSize={8}
                      colorScheme="light"
                      showColorLegend={false}
                      showTotalCount={false}
                    />
                  </div>
                  {/* 데스크탑 */}
                  <div className="hidden md:block">
                    <GitHubCalendar
                      username={github}
                      blockSize={13}
                      blockMargin={2}
                      fontSize={10}
                      colorScheme="light"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 관심 분야 태그 */}
          <div className="flex flex-col gap-[10px]">
            <label className="text-sm font-bold text-gray-700">
              관심 분야 태그
            </label>
            <div className="flex flex-col gap-2">
              {/* 입력창 + 드롭다운을 같은 relative 컨테이너로 묶어 드롭다운 위치 고정 */}
              <div className="relative">
                <div className="w-full min-h-[40px] border border-gray-300 rounded-[8px] px-[14px] py-[6px] flex flex-wrap gap-2 items-center focus-within:border-primary transition-colors">
                  {/* 데스크탑: 태그를 입력칸 안에 표시 */}
                  {selectedTags.map((tag, index) => (
                    <span
                      key={tag.id ?? `new-${index}`}
                      className="hidden md:inline-flex items-center gap-2 px-2.5 py-1 bg-gray-100 text-gray-700 text-base rounded-full"
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
                    onBlur={() => setIsTagFocused(false)}
                    placeholder={selectedTags.length >= 5 ? "" : "태그 입력 (최대 5개)"}
                    disabled={selectedTags.length >= 5}
                    className="flex-1 min-w-[120px] text-base text-surface placeholder:text-gray-500 focus:outline-none bg-transparent disabled:placeholder:text-gray-300"
                  />
                </div>
                {/* 드롭다운: 항상 입력칸 바로 아래 */}
                {showTagDropdown && (
                  <ul className="absolute z-50 top-full left-0 right-0 mt-1 bg-background border border-gray-300 rounded-[8px] shadow-md max-h-48 overflow-y-auto">
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
              {/* 모바일: 선택된 태그를 입력칸 아래에 표시 */}
              {selectedTags.length > 0 && (
                <div className="md:hidden flex flex-wrap gap-2">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={tag.id ?? `new-${index}`}
                      className="inline-flex items-center gap-2 px-[14px] py-[6px] bg-gray-100 text-surface text-sm rounded-full"
                    >
                      {tag.name}
                      <button
                        type="button"
                        onClick={() => removeTag(tag.name)}
                        className="leading-none"
                      >
                        <img src={iconBtnX} alt="" className="w-[18px] h-[18px]" />
                      </button>
                    </span>
                  ))}
                </div>
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
