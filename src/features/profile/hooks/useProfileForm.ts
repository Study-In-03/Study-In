import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, checkNickname, getMemberType } from "@/api/profile";
import { getRegions, Region } from "@/api/auth";
import { getFullUrl } from "@/api/upload";
import { storage } from "@/utils/storage";
import { useAuthStore } from "@/store/authStore";
import useUpload from "@/hooks/useUpload";

type Tag = { id?: number; name: string };

export function useProfileForm() {
    const navigate = useNavigate();
    const { uploading, handleImageUpload } = useUpload();
    const { setIsAssociateMember } = useAuthStore();

    const [profileImg, setProfileImg] = useState<string | null>(null);
    const [profileImgPath, setProfileImgPath] = useState<string | null>(null);
    const [nickname, setNickname] = useState("");
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [nicknameMessage, setNicknameMessage] = useState<string | null>(null);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [bio, setBio] = useState("");
    const [github, setGithub] = useState("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

    useEffect(() => {
        getRegions().then(setRegions).catch(() => {});
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
                if (data.preferred_region) setSelectedRegionId(data.preferred_region.id);
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

    // 닉네임 debounce 자동 체크
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
        setSelectedTags((prev) => prev.filter((t) => t.name !== tagName));
    };

    const addCustomTag = () => {
        if (tagInput.trim() && !selectedTags.find((t) => t.name === tagInput.trim())) {
            setSelectedTags((prev) => [...prev, { name: tagInput.trim() }]);
            setTagInput("");
        }
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = await handleImageUpload(file);
        if (url) {
            setProfileImgPath(url);
            setProfileImg(getFullUrl(url));
        }
    };

    const handleSave = async (redirectTo = "/profile") => {
        const userId = storage.getUserId();
        if (!userId) return;
        setIsSaving(true);
        setApiError(null);
        try {
            await updateProfile(userId, {
                nickname, name, phone,
                introduction: bio,
                github_username: github,
                profile_img: profileImgPath ?? undefined,
                tag: selectedTags,
                preferred_region: selectedRegionId ? { id: selectedRegionId } : undefined,
            });
            try {
                const res = await getMemberType();
                setIsAssociateMember(res.is_associate_member);
            } catch {}
            navigate(redirectTo);
        } catch {
            setApiError("저장에 실패했어요. 다시 시도해주세요.");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        profileImg, profileImgPath,
        nickname, setNickname,
        isNicknameChecked, setIsNicknameChecked,
        nicknameMessage, setNicknameMessage,
        isNicknameAvailable, setIsNicknameAvailable,
        email, name, setName,
        phone, setPhone,
        bio, setBio,
        github, setGithub,
        selectedTags, setSelectedTags,
        tagInput, setTagInput,
        isLoading, isSaving,
        apiError,
        regions, selectedRegionId, setSelectedRegionId,
        isNicknameValid, isGithubValid,
        uploading,
        handleCheckNickname, removeTag, addCustomTag,
        handleImageChange, handleSave,
    };
}