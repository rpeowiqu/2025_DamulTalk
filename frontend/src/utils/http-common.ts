import ky, { type KyResponse } from "ky";

import { postUpdateToken } from "@/services/auth/api";
import type { DamulError } from "@/types/common/type";

let refreshPromise: Promise<string> | null = null;

const reissueAccessToken = async () => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const response = await postUpdateToken();
    const accessToken = response.headers.get("Authorization");
    if (!accessToken) {
      throw new Error("응답 헤더에 엑세스 토큰이 존재하지 않습니다.");
    }

    localStorage.setItem("access-token", accessToken);
    return accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};

export const handleJsonResponse = async <T>(response: KyResponse<T>) => {
  if (!response.ok) {
    const errorBody = await response.json<DamulError>();
    throw new Error(errorBody.message);
  }

  return await response.json<T>();
};

const apiClient = ky.create({
  prefixUrl: "/api",
  timeout: 1_000 * 10, // 10초
  // throwHttpErrors: false, // ky가 자동으로 예외를 던지지 않도록 설정
  hooks: {
    beforeRequest: [
      (request) => {
        const accessToken = localStorage.getItem("access-token");
        if (accessToken) {
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          try {
            const accessToken = await reissueAccessToken();
            request.headers.set("Authorization", `Bearer ${accessToken}`);
            return ky(request, options);
          } catch {
            window.location.replace("/login");
            throw new Error("리이슈 실패");
          }
        }

        return response;
      },
    ],
  },
});

export default apiClient;
