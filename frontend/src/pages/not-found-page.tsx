import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-8 py-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div className="flex flex-col items-center">
          <AlertTriangleIcon className="size-20 text-neutral-200 md:size-28" />
          <h1 className="text-7xl text-neutral-200 md:text-8xl">404</h1>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-damul-main-400 text-2xl font-bold md:text-4xl">
            존재하지 않는 페이지에요
          </h1>
          <p className="text-neutral-500 md:text-lg dark:text-neutral-300">
            URL을 확인해 주세요
          </p>
        </div>
      </div>

      <Link
        to={"/"}
        className="text-damul-main-300 text-2xl font-extrabold select-none md:text-4xl">
        DamulTalk
      </Link>
    </div>
  );
};

export default NotFoundPage;
