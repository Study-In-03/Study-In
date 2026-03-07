import { useState } from 'react';
import CodeIcon from '@/assets/base/icon-code.svg?react';
import EmojiIcon from '@/assets/base/icon-emoji.svg?react';
import ImageIcon from '@/assets/base/icon-Image.svg?react';
import SendIcon from '@/assets/base/icon-Send.svg?react';

export default function ChatInput() {
    const [message, setMessage] = useState('');

    return (
        <div className="lg:p-5 shrink-0">
            <div className="flex items-center bg-background border border-gray-300 lg:rounded-[8px] px-4 py-3">
                
                <button className="text-gray-500 hover:text-primary-light transition-colors shrink-0">
                    <CodeIcon className="w-[26px] h-[26px]" />
                </button>

                <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="메시지를 입력하세요." 
                    className="flex-1 outline-none ml-4 font-regular text-lg text-surface placeholder:text-gray-300"
                />

                <div className="flex items-center gap-3 shrink-0">
                    <button className="text-gray-500 hover:text-primary-light transition-colors">
                        <EmojiIcon className="w-[26px] h-[26px]" />
                    </button>
                        
                    <button className="text-gray-500 hover:text-primary-light transition-colors">
                        <ImageIcon className="w-[26px] h-[26px]" />
                    </button>

                    <div className="w-[2px] h-[26px] bg-gray-300" />

                    <button 
                        disabled={!message.trim()}
                        className={` ${message.trim() ? 'text-primary' : 'text-gray-300'}`}
                    >
                        <SendIcon className="w-[26px] h-[26px]" />
                    </button>
                </div>
            </div>
        </div>
    );
}