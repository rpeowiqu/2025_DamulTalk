import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { postLogout } from "@/services/auth/api";

const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => postLogout(),
    onSuccess: () => {
      queryClient.removeQueries();
      localStorage.removeItem("access-token");
      alert("로그아웃 되었어요");
      navigate("/login");
    },
  });
};

export default useLogout;
