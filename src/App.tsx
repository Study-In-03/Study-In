import './App.css'
import { useEffect } from 'react';
import Router from "./routes/Router";
import Modal from '@/components/common/Modal';
import { useAuthStore } from '@/store/authStore';
import { axiosInstance } from '@/api/axios';

function App() {
  const { isLoggedIn, user, setUser } = useAuthStore();

  useEffect(() => {
    // 로그인 상태인데 유저 정보가 없을 때만 호출
    if (isLoggedIn && !user) {
      axiosInstance.get('/accounts/user/')  // 엔드포인트 확인 필요
        .then(res => setUser(res.data))
        .catch(err => console.error('유저 정보 로드 실패:', err));
    }
  }, [isLoggedIn]);

  return (
    <>
      <Router />
    </>
  );
}

export default App;