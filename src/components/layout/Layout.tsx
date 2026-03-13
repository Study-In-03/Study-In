import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* 
            w-full: 기본적으로 화면을 꽉 채움 (모바일 대응)
            max-w-297.5: 하지만 화면이 아무리 커져도 1190px까지만 늘어남
            mx-auto: 남는 공간은 양옆으로 밀어서 가운데 정렬
            px-4 md:px-8: 모바일일 땐 양옆 여백 16px, 태블릿부터는 32px 여백
        */}
      <main className="w-full max-w-[1190px] mx-auto grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
