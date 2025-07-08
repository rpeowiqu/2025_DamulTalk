import { createContext, useEffect, useState, type ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { getAccessToken } from "@/utils/jwt-token";
import type { WsState } from "@/types/web-socket/type";

export const WebSocketContext = createContext<WsState | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WsState>({
    client: null,
    isConnected: false,
  });

  useEffect(() => {
    if (socket.client) {
      return;
    }

    const connectSocket = async () => {
      const accessToken = getAccessToken();
      if (!accessToken) {
        console.error("액세스 토큰이 존재하지 않습니다.");
        return;
      }

      const client = new Client({
        webSocketFactory: () =>
          new SockJS(
            import.meta.env.VITE_WS_BASE_URL + `?token=${accessToken}`,
          ),
        onConnect: () => {
          setSocket((prev) => ({
            ...prev,
            isConnected: true,
          }));
          console.log("웹소켓에 연결을 시작합니다.");
        },
        onDisconnect: () => {
          setSocket({
            client: null,
            isConnected: false,
          });
          console.log("웹소켓 연결을 종료합니다.");
        },
        onStompError: (error) => {
          console.error("에러가 발생 했습니다: ", error.body);
        },
      });

      client.activate();
      setSocket((prev) => ({
        ...prev,
        client,
      }));
    };

    connectSocket();

    return () => {
      socket.client?.deactivate();
    };
  }, []);

  return <WebSocketContext value={socket}>{children}</WebSocketContext>;
};

export default WebSocketProvider;
