import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { getAccessToken, isTokenExpired } from "@/utils/jwt-token";
import { reissueAccessToken } from "@/utils/http-common";

const ProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthorization = async () => {
      const isExpired = isTokenExpired();
      if (isExpired) {
        try {
          await reissueAccessToken();
        } catch (error) {
          console.error(error);
          navigate("/login");
          return;
        }
      }

      const accessToken = getAccessToken();
      if (!accessToken) {
        navigate("/login");
        return;
      }

      setIsAuthorized(true);
    };

    checkAuthorization();
  }, []);

  if (!isAuthorized) {
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
