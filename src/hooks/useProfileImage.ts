import { useState, useEffect } from 'react';
import { getProfile } from '@/api/profile';
import { getFullUrl } from '@/api/upload';
import { storage } from '@/utils/storage';

function useProfileImage(isLoggedIn: boolean): string | undefined {
  const [profileImg, setProfileImg] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoggedIn) return;
    const userId = storage.getUserId();
    if (!userId) return;
    getProfile(userId)
      .then((profile) => setProfileImg(getFullUrl(profile.profile_img) || undefined))
      .catch(() => {});
  }, [isLoggedIn]);

  return profileImg;
}

export default useProfileImage;
