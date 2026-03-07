import { useState, useRef } from 'react';
import CodeIcon from '@/assets/base/icon-code.svg?react';
import EmojiIcon from '@/assets/base/icon-emoji.svg?react';
import ImageIcon from '@/assets/base/icon-Image.svg?react';
import SendIcon from '@/assets/base/icon-Send.svg?react';
import useUpload from '@/hooks/useUpload';

interface ChatInputProps {
    onSendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const { uploading, handleImageUpload, error } = useUpload(); 
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 텍스트 메시지 전송 핸들러
    const handleSendText = () => {
        if (!message.trim()) return;
        onSendMessage(message, 'text'); //
        setMessage('');
    };

    // 엔터키 전송 지원
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
        }
    };

    // 이미지 파일 선택 및 업로드 핸들러
    const onImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // handleImageUpload를 통해 서버에 업로드 후 URL 획득
        const url = await handleImageUpload(file); 
        
        if (url) {
            // 업로드 성공 시 WebSocket으로 이미지 메시지 전송
            onSendMessage(url, 'image'); 
        }
        
        // input 초기화 (같은 파일 재선택 가능하도록)
        e.target.value = '';
    };

    return (
        <div className="lg:p-5 shrink-0">

            {/* 에러 메시지 표시 (수정 필요) */}
            {error && <p className="text-xs text-error mb-2 px-2">{error}</p>}

            <div className="flex items-center bg-background border border-gray-300 lg:rounded-[8px] px-4 py-3">
                
                <button className="text-gray-500 hover:text-primary-light transition-colors shrink-0">
                    <CodeIcon className="w-[26px] h-[26px]" />
                </button>

                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={uploading ? "업로드 중..." : "메시지를 입력하세요."} 
                    disabled={uploading}
                    className="flex-1 outline-none ml-4 font-regular text-lg text-surface placeholder:text-gray-300"
                />

                <div className="flex items-center gap-3 shrink-0">
                    <button className="text-gray-500 hover:text-primary-light transition-colors">
                        <EmojiIcon className="w-[26px] h-[26px]" />
                    </button>

                    {/* 이미지 업로드 버튼 및 숨겨진 Input */}
                    <input 
                        type="file"
                        ref={fileInputRef}
                        onChange={onImageChange}
                        accept="image/*"
                        className="hidden"
                    />
                        
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="text-gray-500 hover:text-primary-light transition-colors"
                    >
                        <ImageIcon className="w-[26px] h-[26px]" />
                    </button>

                    <div className="w-[2px] h-[26px] bg-gray-300" />

                    <button 
                        onClick={handleSendText}
                        disabled={!message.trim() || uploading}
                        className={`transition-colors ${message.trim() && !uploading ? 'text-primary' : 'text-gray-300'}`}
                    >
                        <SendIcon className="w-[26px] h-[26px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}