import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { postLogout } from "@/services/auth/api";
import useSideBarTabStore from "@/store/side-bar-tab-store";

const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => postLogout(),
    onSuccess: () => {
      // 모든 캐시 삭제
      queryClient.removeQueries();

      // 액세스 토큰 삭제
      localStorage.removeItem("access-token");

      // 탭 관련 스토리지 데이터 및 store 상태 초기화
      useSideBarTabStore.persist.clearStorage();
      useSideBarTabStore.setState({
        currentTab: "FRIEND",
        tabNotifications: {
          FRIEND: false,
          CHAT: false,
        },
      });

      toast.success("로그아웃 되었어요");

      // 로그아웃 시에는 navigate가 아닌 window 객체를 이용해 새로고침이 일어나도록 완전히 초기화
      window.location.href = "/login";
    },
  });
};

export default useLogout;
