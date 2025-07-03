import { type Dispatch, type SetStateAction } from "react";

import Dialog, { type DialogProps } from "@/components/common/dialog";
import AutocompleteSearchBar from "@/components/common/auto-complete-search-bar";
import { getUserSearch } from "@/services/community/api";
import type { User } from "@/types/user/type";
import type { FriendSearchResponse } from "@/types/community/type";
import UserSearchItem from "@/components/community/user-search-item";

interface UserSearchModalProps extends DialogProps {
  keyword: string;
  setKeyword: Dispatch<SetStateAction<string>>;
}

const UserSearchModal = ({
  keyword,
  setKeyword,
  open,
  onOpenChange,
  ...props
}: UserSearchModalProps) => {
  const queryFn = async (pageParam: string) => {
    const response = await getUserSearch({
      nickname: keyword,
      cursor: pageParam,
      size: 10,
    });

    if (response.status === 204) {
      return {
        data: [],
        meta: {
          hasNext: false,
          nextCursor: "",
        },
      };
    }

    const data = await response.json<FriendSearchResponse>();
    return data;
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="유저 찾기"
      titleClassName="text-damul-main-300 border-b border-damul-main-500 pb-4"
      {...props}>
      <AutocompleteSearchBar<User>
        keyword={keyword}
        setKeyword={setKeyword}
        infiniteQueryOptions={{
          queryKey: ["user-search", keyword],
          queryFn: ({ pageParam }) => queryFn(pageParam as string),
          initialPageParam: "",
          getNextPageParam: (lastPage) =>
            lastPage.meta.hasNext ? lastPage.meta.nextCursor : undefined,
        }}
        renderItem={(item, keyword) => (
          <UserSearchItem key={item.userId} user={item} keyword={keyword} />
        )}
        renderSkeleton={() => (
          <div className="h-5 animate-pulse rounded-lg bg-neutral-200" />
        )}
      />
    </Dialog>
  );
};

export default UserSearchModal;
