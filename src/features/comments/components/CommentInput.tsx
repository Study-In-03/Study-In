import { useState } from 'react';

interface CommentInputProps {
  onSubmit: (content: string) => void;
}

const CommentInput = ({ onSubmit }: CommentInputProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <div className="flex gap-2 items-center mt-4">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        placeholder="댓글을 입력하세요"
        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
      />
      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
          content.trim()
            ? 'bg-primary text-white cursor-pointer'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        등록
      </button>
    </div>
  );
};

export default CommentInput;