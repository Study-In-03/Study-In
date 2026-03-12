import { useState, useRef } from 'react';
import CodeIcon from '@/assets/base/icon-code.svg?react';
import EmojiIcon from '@/assets/base/icon-emoji.svg?react';
import ImageIcon from '@/assets/base/icon-Image.svg?react';
import SendIcon from '@/assets/base/icon-Send.svg?react';
import DeleteIcon from '@/assets/base/icon-btn-X-blue.svg?react';
import useUpload from '@/hooks/useUpload';

interface ChatInputProps {
    onSendMessage: (content: string, type?: 'text' | 'image' | 'file') => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [previewImages, setPreviewImages] = useState<{ file: File; url: string }[]>([]);
    const { uploading, handleImageUpload, error } = useUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSendText = () => {
        if (!message.trim() && previewImages.length === 0) return;
        if (previewImages.length > 0) {
            handleSendWithImages();
            return;
        }
        onSendMessage(message, 'text');
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendText();
        }
    };

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setPreviewImages((prev) => [...prev, { file, url: previewUrl }]);
        e.target.value = '';
    };

    const handleSendWithImages = async () => {
        for (const img of previewImages) {
            const uploadedUrl = await handleImageUpload(img.file);
            if (uploadedUrl) onSendMessage(uploadedUrl, 'image');
            URL.revokeObjectURL(img.url);
        }
        setPreviewImages([]);
        if (message.trim()) {
            onSendMessage(message, 'text');
            setMessage('');
        }
    };

    return (
        <div className="md:pb-5 md:px-5 shrink-0">

            {error && <p className="text-xs text-error mb-2 px-2">{error}</p>}

            {/* 이미지 미리보기 패널 */}
            {previewImages.length > 0 && (
                <div className="border border-gray-300 md:rounded-t-[8px] bg-background px-3 py-3">
                    <div className="flex gap-3 flex-wrap">
                        {previewImages.map((img, i) => (
                            <div key={i} className="relative w-[180px] h-[160px]">
                                <img
                                    src={img.url}
                                    alt="미리보기"
                                    className="w-full h-full object-cover rounded-[4px] border border-gray-300 hover:border-gray-700"
                                />
                                <button
                                    onClick={() => {
                                        URL.revokeObjectURL(img.url);
                                        setPreviewImages((prev) => prev.filter((_, idx) => idx !== i));
                                    }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <DeleteIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 입력창 */}
            <div className={`flex items-center bg-background border border-gray-300 px-4 py-3 md:rounded-b-[8px]`}>
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
                        disabled={(!message.trim() && previewImages.length === 0) || uploading}
                        className={`transition-colors ${(message.trim() || previewImages.length > 0) && !uploading ? 'text-primary' : 'text-gray-300'}`}
                    >
                        <SendIcon className="w-[26px] h-[26px]" />
                    </button>
                </div>
            </div>

        </div>
    );
}