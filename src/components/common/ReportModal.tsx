import { useState } from 'react'
import { createReport, REPORT_REASONS, ReportTargetType } from '@/api/report'
import { useSnackbarStore } from '@/store/snackbarStore'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetType: ReportTargetType
  targetId: number
}

const ReportModal = ({ isOpen, onClose, targetType, targetId }: ReportModalProps) => {
  const [selectedReason, setSelectedReason] = useState<number | null>(null)
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showSnackbar } = useSnackbarStore()

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!selectedReason) {
      setError('신고 사유를 선택해주세요.')
      return
    }

    if (!content.trim()) {
      setError('신고 내용을 입력해주세요.')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await createReport({
        report_reason: selectedReason,
        report_content: content,
        ...(targetType === 'study' && { reported_study: targetId }),
        ...(targetType === 'user' && { reported_user: targetId }),
        ...(targetType === 'comment' && { reported_comment: targetId }),
        ...(targetType === 'recomment' && { reported_recomment: targetId }),
      })
      showSnackbar()
      handleClose()
    } catch {
      setError('신고 접수에 실패했어요. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setSelectedReason(null)
    setContent('')
    setError(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative bg-background rounded-xl w-72 px-5 py-5 flex flex-col gap-3 z-10">

        <h2 className="text-base font-bold text-gray-900 text-center">신고하기</h2>

        <>
            <div className="flex flex-col gap-2">
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className="flex items-center gap-2 w-full text-left"
                >
    
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedReason === reason.id
                      ? 'border-primary'
                      : 'border-gray-300'
                  }`}>
                    {selectedReason === reason.id && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className={`text-sm ${
                    selectedReason === reason.id ? 'text-primary' : 'text-gray-700'
                  }`}>
                    {reason.label}
                  </span>
                </button>
              ))}
            </div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, 500))}
              placeholder="상세 내용을 입력해주세요."
              className="w-full h-16 px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-900 resize-none focus:outline-none focus:border-primary"
            />
            {error && (
              <p className="text-xs text-error">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-2 bg-primary text-background rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {isLoading ? '접수 중...' : '신고하기'}
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-2 border border-gray-300 text-gray-500 rounded-lg text-sm font-medium"
              >
                취소
              </button>
            </div>
        </>
      </div>
    </div>
  )
}

export default ReportModal