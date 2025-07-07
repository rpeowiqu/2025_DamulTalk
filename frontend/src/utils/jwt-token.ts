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
    console.error("Fail to decode jwt token:", error);
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
      console.error("jwt token was expired!");
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
