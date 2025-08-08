import { type Dispatch, type SetStateAction } from "react";
import type { QueryFunctionContext } from "@tanstack/react-query";

import Dialog, { type DialogProps } from "@/components/common/dialog";
import AutocompleteSearchBar from "@/components/common/auto-complete-search-bar";
import { getUserSearch } from "@/services/community/api";
import type { User, FriendSearchResponse } from "@/types/community/type";
import UserSearchItem from "@/components/community/user-search-item";
import type { DamulError } from "@/types/common/type";
import { handleJsonResponse } from "@/utils/http-common";

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
  const queryFn = async ({ pageParam }: QueryFunctionContext) => {
    const response = await getUserSearch({
      nickname: keyword,
      cursor: pageParam as string,
      size: pageParam ? 10 : undefined,
    });

    if (response.status === 204) {
      return {
        data: [],
        meta: {
          hasNext: false,
          nextCursor: "",
        },
      };
    } else if (!response.ok) {
      const errorBody = await response.json<DamulError>();
      throw new Error(errorBody.message);
    }

    return handleJsonResponse<FriendSearchResponse>(response);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="유저 찾기"
      titleClassName="text-damul-main-300 border-b border-damul-main-500 pb-4 mb-2"
      {...props}>
      <AutocompleteSearchBar<User>
        keyword={keyword}
        setKeyword={setKeyword}
        infiniteQueryOptions={{
          queryKey: ["user-search", keyword],
          queryFn,
          initialPageParam: null,
          getNextPageParam: (lastPage) =>
            lastPage.meta.hasNext ? lastPage.meta.nextCursor : null,
        }}
        renderItem={(item, keyword) => (
          <UserSearchItem key={item.userId} user={item} keyword={keyword} />
        )}
        renderSkeleton={() => (
          <div className="h-5 animate-pulse rounded-sm bg-neutral-200 dark:bg-neutral-500" />
        )}
      />
    </Dialog>
  );
};

export default UserSearchModal;
