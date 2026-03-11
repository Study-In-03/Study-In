import { useNavigate } from "react-router-dom";
import notFoundImg from "@/assets/base/404.svg";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">

      <div className="flex flex-row items-center gap-[50px] w-[780px] h-[320px] shrink-0">

        {/* 이미지 카드 */}
        <div className="w-[320px] h-[320px] rounded-[30px] bg-gray-100 flex items-center justify-center shrink-0">
          <img
            src={notFoundImg}
            alt="404"
            className="w-full h-full object-cover rounded-[30px]"
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="flex flex-col gap-[30px]">

          <div className="flex flex-col gap-[4px]">
            <h1 className="text-[100px] leading-[125px] font-bold text-primary">
              404
            </h1>
            <h2 className="text-3xl leading-[40px] font-bold text-surface">
              페이지를 찾을 수 없습니다.
            </h2>
          </div>

          <div className="flex flex-col gap-[16px]">
            <p className="text-lg leading-[24px] font-medium text-gray-700">
              페이지가 존재하지 않거나 사용할 수 없는 페이지입니다.
              <br />
              웹 주소가 올바른지 확인해 주세요.
            </p>

            <div className="flex gap-[10px]">

              <button
                onClick={() => navigate("/")}
                className="w-[200px] h-[50px] bg-primary text-background rounded-[8px] text-lg"
              >
                메인으로
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-[200px] h-[50px] bg-background border border-gray-300 rounded-[8px] text-[16px] text-surface"
              >
                이전 페이지
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default NotFound;