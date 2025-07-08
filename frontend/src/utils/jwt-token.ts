import { jwtDecode } from "jwt-decode";

interface JWTPayload {
  iat: number;
  exp: number;
  sub: string;
  userId: number;
}

const getPayload = () => {
  const accessToken = localStorage.getItem("access-token");
  if (!accessToken) {
    return null;
  }

  try {
    return jwtDecode<JWTPayload>(accessToken);
  } catch (error) {
    console.error("JWT 토큰을 복호화하지 못했습니다.", error);
    return null;
  }
};

export const isTokenExpired = () => {
  const payload = getPayload();
  if (!payload) {
    return true;
  } else {
    const now = Math.floor(Date.now() / 1_000);
    if (now >= payload.exp) {
      console.error("JWT 토큰이 만료 되었습니다.");
      return true;
    }
  }

  return false;
};

export const getAccessToken = () => {
  const accessToken = localStorage.getItem("access-token");
  if (!accessToken) {
    return null;
  }

  return accessToken;
};
