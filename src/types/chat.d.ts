export interface ChatProfile {
    nickname: string;
    profile_img: string | null;
}

export interface ChatUser {
    // 시스템 메시지(notice)일 경우 null
    pk: number | null; 
    profile: ChatProfile;
}

export interface ChatMessage {
    pk: number;
    user: ChatUser;
    chat_type: 'text' | 'image' | 'file' | 'notice';
    message: string | null;
    image_url: string | null;
    file_url: string | null;
    created: string; // ISO 8601 형식
}

export interface ChatListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ChatMessage[];
}

export interface ImageUploadResponse {
    detail: string;
    image_url: string;
}

export interface FileUploadResponse {
    detail: string;
    file_url: string;
}