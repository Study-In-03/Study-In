import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GitHubCalendar } from 'react-github-calendar'
import useUpload from '@/hooks/useUpload'
import { getFullUrl } from '@/api/upload'
import { getProfile, updateProfile, checkNickname } from '@/api/profile'
import { storage } from '@/utils/storage'
import PersonIcon from '@/assets/base/icon-person.svg?react'
import ImageIcon from '@/assets/base/icon-Image.svg?react'
import CheckIcon from '@/assets/base/icon-Check.svg?react'
import CloseIcon from '@/assets/base/icon-X.svg?react'

const allTags = ['Python', 'JS', 'Java', 'React', 'Django', '크롬확장프로그램', '사이드프로젝트', '알고리즘', '취업준비']
const MAX_BIO_LENGTH = 80

const ProfileEditForm = () => {
  const navigate = useNavigate()
  const { uploading, handleImageUpload } = useUpload()

  const [profileImg, setProfileImg] = useState<string | null>(null)
  const [profileImgPath, setProfileImgPath] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [nickname, setNickname] = useState('')
  const [isNicknameChecked, setIsNicknameChecked] = useState(false)
  const [nicknameMessage, setNicknameMessage] = useState<string | null>(null)
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [bio, setBio] = useState('')
  const [region, setRegion] = useState('')
  const [github, setGithub] = useState('')
  const [selectedTags, setSelectedTags] = useState<Array<{ id: number; name: string }>>([])
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = storage.getUserId()
      if (!userId) return
      try {
        const data = await getProfile(userId)
        setNickname(data.nickname)
        setName(data.name ?? '')
        setPhone(data.phone ?? '')
        setBio(data.introduction ?? '')
        setRegion(data.preferred_region?.location ?? '')
        setGithub(data.github_username ?? '')
        setSelectedTags(data.tag ?? [])
        if (data.profile_img) {
          setProfileImg(getFullUrl(data.profile_img))
          setProfileImgPath(data.profile_img)
        }
        const emailFromStorage = storage.getEmail()
        if (emailFromStorage) setEmail(emailFromStorage)
        setIsNicknameChecked(true)
        setIsNicknameAvailable(true)
      } catch {
        setApiError('프로필을 불러오는 데 실패했어요.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const isNicknameValid = nickname.length >= 2
  const isGithubValid = github === '' || /^[a-zA-Z0-9-]+$/.test(github)
  const isSaveEnabled = isNicknameValid && isNicknameChecked && isNicknameAvailable && isGithubValid && name !== '' && phone !== ''

  const handleCheckNickname = async () => {
    const result = await checkNickname(nickname)
    setIsNicknameChecked(true)
    setIsNicknameAvailable(result.available)
    setNicknameMessage(result.message)
  }

  const toggleTag = (tag: string) => {
    const exists = selectedTags.find((t) => t.name === tag)
    if (exists) {
      setSelectedTags(selectedTags.filter((t) => t.name !== tag))
    } else {
      if (selectedTags.length >= 5) return
      setSelectedTags([...selectedTags, { id: Date.now(), name: tag }])
    }
  }

  const removeTag = (tagName: string) => {
    setSelectedTags(selectedTags.filter((t) => t.name !== tagName))
  }

  const addCustomTag = () => {
    if (tagInput.trim() && !selectedTags.find((t) => t.name === tagInput.trim()) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, { id: Date.now(), name: tagInput.trim() }])
      setTagInput('')
    }
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await handleImageUpload(file)
    if (url) {
      setProfileImgPath(url)
      setProfileImg(getFullUrl(url))
    }
  }

  const handleSave = async () => {
    const userId = storage.getUserId()
    if (!userId) return
    setIsSaving(true)
    setApiError(null)
    try {
      await updateProfile(userId, {
        nickname,
        name,
        phone,
        introduction: bio,
        github_username: github,
        profile_img: profileImgPath ?? undefined,
        tag: selectedTags,
      })
      navigate('/profile')
    } catch {
      setApiError('저장에 실패했어요. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 text-gray-500 text-sm">
        불러오는 중...
      </div>
    )
  }

  return (
    <div className="flex flex-col py-3 gap-4 bg-background w-full">

      <div className="flex flex-col border border-gray-300 rounded-xl overflow-hidden">

        <div className="flex flex-col items-center gap-3 px-6 py-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {profileImg ? (
                <img src={profileImg} alt="프로필 이미지" className="w-full h-full object-cover" />
              ) : (
                <PersonIcon className="w-12 h-12 text-gray-300" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center"
            >
              <ImageIcon className="w-3 h-3 text-background" />
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-1 items-center w-full max-w-xs">
            <div className="flex items-center gap-2 w-full border-b border-gray-300 pb-1">
              <input
                type="text"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value)
                  setIsNicknameChecked(false)
                  setIsNicknameAvailable(false)
                  setNicknameMessage(null)
                }}
                className="flex-1 text-base font-bold text-gray-900 bg-transparent focus:outline-none text-center"
              />
              <button onClick={handleCheckNickname} disabled={!isNicknameValid} className="shrink-0">
                <CheckIcon className={`w-5 h-5 ${isNicknameValid ? 'text-primary' : 'text-gray-300'}`} />
              </button>
            </div>
            {nicknameMessage && (
              <p className={`text-sm ${isNicknameAvailable ? 'text-primary' : 'text-error'}`}>
                {nicknameMessage}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <textarea
              placeholder="소개를 입력해주세요"
              value={bio}
              maxLength={MAX_BIO_LENGTH}
              onChange={(e) => setBio(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 resize-none h-20 focus:outline-none focus:border-primary w-full"
            />
            <p className="text-xs text-gray-500 text-right">{bio.length}/{MAX_BIO_LENGTH}</p>
          </div>
        </div>

        <div className="w-full border-t border-gray-300" />
        <div className="flex flex-col gap-4 px-6 py-5">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 w-24 shrink-0">이메일(ID)</span>
            <span className="text-sm text-gray-500">{email}</span>
          </div>

  
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
              이름 <span className="text-error">*</span>
            </label>
            <input
              type="text"
              placeholder="이름 입력"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-72 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-primary"
            />
          </div>


          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0">
              전화번호 <span className="text-error">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="010-0000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-72 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="w-20 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 shrink-0">
                인증
              </button>
            </div>
          </div>

    
          <div className="flex items-center">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0">내 지역</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="지역 입력"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-72 border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-primary"
              />
              <button className="w-20 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 shrink-0">
                재인증
              </button>
            </div>
          </div>


          <div className="flex items-start">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0 pt-1.5">
              GitHub<br />User Name
            </label>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="GitHub 아이디"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className={`w-72 border rounded-lg px-3 py-1.5 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none ${
                    github && !isGithubValid ? 'border-error' : 'border-gray-300 focus:border-primary'
                  }`}
                />
                <button className="w-20 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-700 shrink-0">
                  {github ? '연동 해제' : '인증'}
                </button>
              </div>
              {github && !isGithubValid && (
                <p className="text-xs text-error">영문, 숫자, 하이픈(-)만 입력 가능해요!</p>
              )}
              {github && isGithubValid && (
                <div className="w-full overflow-x-auto">
                  <GitHubCalendar
                    username={github}
                    blockSize={8}
                    blockMargin={2}
                    fontSize={8}
                    colorScheme="light"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start">
            <label className="text-sm font-medium text-gray-700 w-24 shrink-0 pt-2">관심 분야 태그</label>
            <div className="flex flex-col gap-2 flex-1">
              <div className="border border-gray-300 rounded-lg px-3 py-2 flex flex-wrap gap-2 items-center">
                {selectedTags.map((tag) => (
                  <span
                    key={tag.id}
                    className="flex items-center gap-1 bg-primary text-background text-xs px-2.5 py-1 rounded-full"
                  >
                    {tag.name}
                    <button onClick={() => removeTag(tag.name)}>
                      <CloseIcon className="w-2.5 h-2.5 text-background" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  placeholder={selectedTags.length >= 5 ? '' : '태그 입력 (최대 5개)'}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
                  disabled={selectedTags.length >= 5}
                  className="flex-1 min-w-20 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none bg-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-3 py-1 rounded-full ${
                      selectedTags.find((t) => t.name === tag)
                        ? 'bg-primary text-background'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {apiError && (
        <p className="text-sm text-error text-center">{apiError}</p>
      )}

      <div className="flex items-center justify-between px-2">
        <div className="flex-1" />
        <button
          onClick={handleSave}
          disabled={!isSaveEnabled || isSaving}
          className={`w-36 py-2.5 rounded-lg text-base ${
            isSaveEnabled && !isSaving
              ? 'bg-primary text-background'
              : 'bg-gray-300 text-background cursor-not-allowed'
          }`}
        >
          {isSaving ? '저장 중...' : '저장하기'}
        </button>
        <div className="flex-1 flex justify-end">
          <a
            href="https://weniv.world"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-gray-500 underline"
          >
            위니브월드 탈퇴하기
          </a>
        </div>
      </div>

    </div>
  )
}

export default ProfileEditForm