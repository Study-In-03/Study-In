import { useEffect } from 'react';
import Router from "./routes/Router";
import { useAuthStore } from '@/store/authStore';
import { getProfile } from '@/api/profile';
import { storage } from '@/utils/storage';
import Snackbar from '@/components/common/Snackbar';

function App() {
  const { isLoggedIn, user, setUser } = useAuthStore();

  useEffect(() => {
    if (isLoggedIn && !user) {
      const userId = storage.getUserId();
      if (!userId) return;
      getProfile(userId)
        .then(res => setUser({ pk: res.user, email: storage.getEmail() ?? '', nickname: res.nickname }))
        .catch(err => console.error('유저 정보 로드 실패:', err));
    }
  }, [isLoggedIn, user, setUser]);

  return (
    <>
      <Router />
      <Snackbar />
    </>
  );
}

export default App;