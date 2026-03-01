import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useUpload from '@/hooks/useUpload'
import { getFullUrl } from '@/api/upload'
import personIcon from '@/assets/base/icon-person.svg'

// 선택 가능한 전체 태그 목록
const allTags = ['Python', 'JS', 'Java', 'React', 'Django', '크롬확장프로그램', '사이드프로젝트', '알고리즘', '취업준비']

// 소개 최대 글자수
const MAX_BIO_LENGTH = 200

const ProfileEditForm = () => {
  const navigate = useNavigate()
  const { uploading, handleImageUpload } = useUpload()

  // 프로필 이미지 상태
  const [profileImg, setProfileImg] = useState<string | null>(null)
  // 파일 input 참조
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 닉네임 입력값 상태 관리
  const [nickname, setNickname] = useState('')
  // 닉네임 중복확인 여부 상태
  const [isNicknameChecked, setIsNicknameChecked] = useState(false)
  // 소개 입력값 상태 관리
  const [bio, setBio] = useState('')
  // 지역 입력값 상태 관리
  const [region, setRegion] = useState('')
  // GitHub 입력값 상태 관리
  const [github, setGithub] = useState('')
  // 선택된 태그 상태 관리
  const [selectedTags, setSelectedTags] = useState<string[]>(['Python', 'JS'])

  // 닉네임 유효성 검사 - 2자 이상
  const isNicknameValid = nickname.length >= 2
  // GitHub 유효성 검사 - 영문/숫자/하이픈만 허용
  const isGithubValid = github === '' || /^[a-zA-Z0-9-]+$/.test(github)

  // 저장하기 버튼 활성화 조건
  const isSaveEnabled = isNicknameValid && isNicknameChecked && isGithubValid

  // 태그 클릭시 선택/해제
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  // 이미지 파일 선택 시 업로드
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleImageUpload(file)
    if (url) setProfileImg(getFullUrl(url))
  }

  return (
    <div className="flex flex-col px-4 py-6 gap-4 bg-background">

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center gap-1 text-base text-gray-700"
      >
        ← 뒤로가기
      </button>

      {/* 프로필 이미지 수정 */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
          {profileImg ? (
            <img src={profileImg} alt="프로필 이미지" className="w-full h-full object-cover" />
          ) : (
            <img src={personIcon} alt="프로필 이미지" className="w-14 h-14" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageChange}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-base text-primary font-medium"
        >
          {uploading ? '업로드 중...' : '이미지 변경'}
        </button>
      </div>

      {/* 닉네임 - 변경시 중복확인 필수 */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium text-gray-900">닉네임</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="닉네임 입력 (2자 이상)"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value)
              setIsNicknameChecked(false) // 닉네임 변경시 중복확인 초기화
            }}
            className={`flex-1 border rounded-lg px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none ${
              nickname && !isNicknameValid
                ? 'border-error'
                : 'border-gray-300 focus:border-primary-light'
            }`}
          />
          <button
            onClick={() => setIsNicknameChecked(true)}
            disabled={!isNicknameValid}
            className={`px-3 py-2 text-background text-base rounded-lg ${
              isNicknameValid ? 'bg-primary' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            중복확인
          </button>
        </div>
        {/* 닉네임 오류 메시지 */}
        {nickname && !isNicknameValid && (
          <p className="text-sm text-error">닉네임은 2자 이상 입력해주세요!</p>
        )}
        {/* 중복확인 완료 메시지 */}
        {isNicknameChecked && (
          <p className="text-sm text-primary">사용 가능한 닉네임입니다!</p>
        )}
      </div>

      {/* 소개 - 글자수 제한 표시 */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium text-gray-900">소개</label>
        <textarea
          placeholder="소개를 입력해주세요"
          value={bio}
          maxLength={MAX_BIO_LENGTH}
          onChange={(e) => setBio(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 resize-none h-24 focus:outline-none focus:border-primary-light"
        />
        {/* 글자수 표시 */}
        <p className="text-xs text-gray-500 text-right">{bio.length}/{MAX_BIO_LENGTH}자</p>
      </div>

      {/* 선호 지역 */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium text-gray-900">내 지역</label>
        <input
          type="text"
          placeholder="지역 입력"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-primary-light"
        />
      </div>

      {/* GitHub - 영문/숫자/하이픈만 허용 */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium text-gray-900">GitHub</label>
        <input
          type="text"
          placeholder="GitHub 아이디 입력 (영문/숫자/하이픈)"
          value={github}
          onChange={(e) => setGithub(e.target.value)}
          className={`border rounded-lg px-3 py-2 text-base text-gray-900 placeholder:text-gray-500 focus:outline-none ${
            github && !isGithubValid
              ? 'border-error'
              : 'border-gray-300 focus:border-primary'
          }`}
        />
        {/* GitHub 오류 메시지 */}
        {github && !isGithubValid && (
          <p className="text-sm text-error">영문, 숫자, 하이픈(-)만 입력 가능해요!</p>
        )}
      </div>

      {/* 관심 분야 태그 */}
      <div className="flex flex-col gap-1">
        <label className="text-base font-medium text-gray-900">관심 분야</label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-sm px-3 py-1 rounded-full ${
                selectedTags.includes(tag)
                  ? 'bg-activation text-primary'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 저장하기 버튼 */}
      <button
        disabled={!isSaveEnabled}
        className={`mt-4 w-full py-2 rounded-lg text-base ${
          isSaveEnabled
            ? 'bg-primary text-background cursor-pointer'
            : 'bg-gray-300 text-background cursor-not-allowed'
        }`}
      >
        저장하기
      </button>

    </div>
  )
}

export default ProfileEditForm