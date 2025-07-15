import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-8 py-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-8xl text-neutral-200">404</h1>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-damul-main-400 text-4xl font-bold">
            존재하지 않는 페이지에요
          </h1>
          <p className="text-lg text-neutral-500">URL을 확인해 주세요</p>
        </div>
      </div>

      <Link
        to={"/"}
        className="text-damul-main-300 text-4xl font-extrabold select-none">
        DamulTalk
      </Link>
    </div>
  );
};

export default NotFoundPage;
