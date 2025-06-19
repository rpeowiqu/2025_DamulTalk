import SearchBar from "@/components/common/search-bar";
import FriendList from "@/components/user/friend-list";

const ProfileContent = () => {
  return (
    <div className="flex min-h-0 flex-1 gap-4">
      <div className="flex flex-1 flex-col gap-4">
        <h1 className="text-xl font-bold">상세 정보</h1>
        <ul className="flex list-disc flex-col gap-4 pl-8">
          <li>
            <p className="font-bold">가입일</p>
            <p className="text-neutral-500">2025년 06월 11일</p>
          </li>

          <li>
            <p className="font-bold">상태 메시지</p>
            <p className="whitespace-pre-line text-neutral-500">
              {
                "안녕하세요, 반갑습니다.\n팀 50일에서 다믈랭에 이어 메신저 서비스인 다믈톡을 개발 중에 있습니다.\n많은 관심 부탁드립니다."
              }
            </p>
          </li>
        </ul>
      </div>

      <div className="h-full w-0.5 bg-neutral-50"></div>

      <div className="flex min-w-64 flex-col gap-4">
        <h1 className="text-xl font-bold">친구</h1>
        <div className="scroll-hidden flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
          <SearchBar onSearch={(keyword) => console.log(keyword)} />
          <FriendList visibleStatus={false} />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
