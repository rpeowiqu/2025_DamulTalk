import { createContext, useEffect, useRef, type ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { getAccessToken, isTokenExpired } from "@/utils/jwt-token";
import { reissueAccessToken } from "@/utils/http-common";

export const WebSocketContext = createContext<Client | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const connectSocket = async () => {
      // 액세스 토큰이 만료 됐는지 검사하고, 만료 됐다면 리이슈 요청 후 웹 소켓에 연결한다.
      const isExpired = isTokenExpired();
      if (isExpired) {
        await reissueAccessToken();
      }

      const accessToken = getAccessToken();
      clientRef.current = new Client({
        webSocketFactory: () =>
          new SockJS(
            import.meta.env.VITE_WS_BASE_URL + `?token=${accessToken}`,
          ),
        onConnect: () => {
          console.log("WebSocket connected!");
        },
        onDisconnect: () => {
          console.log("WebSocket disconnected.");
        },
      });
      clientRef.current.activate();
    };

    connectSocket();

    return () => {
      clientRef.current?.deactivate();
    };
  }, []);

  return (
    <WebSocketContext value={clientRef.current}>{children}</WebSocketContext>
  );
};

export default WebSocketProvider;
