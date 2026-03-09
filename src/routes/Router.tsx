import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from '@/store/authStore';
import Home from "@/pages/Home";
import StudyDetail from "@/pages/StudyDetail";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import MyStudy from "@/pages/Mystudy";
import StudyCreate from "@/pages/StudyCreate";
import StudyEdit from "@/pages/StudyEdit";
import Layout from '@/components/layout/Layout';
import AuthLayout from '@/components/layout/AuthLayout';
import ChatLayout from '@/components/layout/ChatLayout';
import Login from '@/pages/Login';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import Notification from '@/pages/Notification';
import Register from '@/pages/Register';
import CommentWritePage from '@/pages/CommentWritePage';
import Chat from '@/pages/Chat';
import Search from '@/pages/Search';
import LocalStudy from "@/pages/LocalStudy";
import OnlineStudy from "@/pages/OnlineStudy";
import Modal from '@/components/common/Modal';

function PrivateRoute() {
    const { isLoggedIn } = useAuthStore();
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}

export default function Router() {
  return (
    <BrowserRouter>
      <Modal />
      <Routes>
        {/* 공통 레이아웃 (헤더 + 푸터) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/study/:studyId" element={<StudyDetail />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/edit" element={<ProfileEdit />} />
          {/* 마이 스터디 페이지 - B2 담당 */}
          <Route path="/my-study" element={<MyStudy />} />
          {/* 알림 페이지 - B2 담당 */}
          <Route path="/notification" element={<Notification />} />
        </Route>

        <Route element={<ChatLayout />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:study_pk" element={<Chat />} />
        </Route>

        {/* 스터디 */}
        <Route path="/study/create" element={<StudyCreate />} />
        <Route
          path="/study/:studyId/comment/write"
          element={<CommentWritePage />}
        />
        <Route path="/study/:studyId/edit" element={<StudyEdit />} />
        <Route path="/local" element={<LocalStudy />} />
        <Route path="/online" element={<OnlineStudy />} />

        {/* 인증 관련 레이아웃 */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
