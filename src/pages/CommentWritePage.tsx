import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createComment } from '@/api/comment';

const CommentWritePage = () => {
  const { studyId } = useParams<{ studyId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const MAX_LENGTH = 1000;

  const handleSubmit = async () => {
    if (!content.trim()) return;
    await createComment(Number(studyId), { content, is_secret: isSecret });
    navigate(-1);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={() => navigate(-1)} className="text-gray-700">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-bold">댓글 작성</h1>
        <div className="w-6" />
      </div>

      {/* textarea */}
      <div className="flex-1 px-4 pt-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden h-[280px]">
          <textarea
            value={content}
            onChange={(e) => {
              if (e.target.value.length <= MAX_LENGTH) setContent(e.target.value);
            }}
            placeholder="다른 사람의 권리를 침해하거나 명예를 훼손하는 댓글은 관련 법률에 의해 제재를 받을 수 있습니다."
            className="w-full h-full px-4 pt-4 pb-2 text-sm text-gray-700 placeholder:text-gray-400 resize-none focus:outline-none"
            autoFocus
          />
        </div>
        <p className="text-right text-xs text-gray-400 mt-1 pr-1">{content.length}/{MAX_LENGTH}</p>
      </div>

      {/* 하단 고정 바 */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center border-t border-gray-200 bg-white">
        <label className="flex items-center gap-2 flex-1 px-4 py-3 cursor-pointer">
          <input
            type="checkbox"
            checked={isSecret}
            onChange={(e) => setIsSecret(e.target.checked)}
            className="w-4 h-4 accent-primary"
          />
          <span className={`text-sm font-medium ${isSecret ? 'text-primary' : 'text-gray-400'}`}>
            비밀댓글
          </span>
        </label>
        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className={`px-8 py-3 text-sm font-medium border-l border-gray-200 ${
            content.trim() ? 'text-gray-700' : 'text-gray-300'
          }`}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default CommentWritePage;