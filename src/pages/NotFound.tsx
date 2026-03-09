import { useNavigate } from "react-router-dom";
import notFoundImg from "@/assets/404-illustration.png";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">

      <div className="flex items-center gap-[50px] w-[780px]">

        {/* 이미지 카드 */}
        <div className="bg-gray-100 rounded-2xl p-8 flex items-center justify-center">
          <img
            src={notFoundImg}
            alt="404"
            className="w-[200px]"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col">

          <h1 className="text-5xl font-bold text-primary mb-2">
            404
          </h1>

          <h2 className="text-lg font-medium text-gray-900 mb-2">
            페이지를 찾을 수 없습니다.
          </h2>

          <p className="text-sm text-gray-500 mb-6">
            페이지가 존재하지 않거나 사용할 수 없는 페이지입니다.
            <br />
            웹 주소가 올바른지 확인해 주세요.
          </p>

          <div className="flex gap-3">

            <button
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-primary text-white rounded-md"
            >
              메인으로
            </button>

            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 rounded-md"
            >
              이전 페이지
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NotFound;