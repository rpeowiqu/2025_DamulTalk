import { createContext, useEffect, useState, type ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

import { getAccessToken } from "@/utils/jwt-token";
import type { WsDispatch, WsState } from "@/types/web-socket/type";

export const WebSocketStateContext = createContext<WsState | null>(null);
export const WebSocketDispatchContext = createContext<WsDispatch | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const [socket, setSocket] = useState<WsState>({
    client: null,
    isConnected: false,
  });

  const publishMessage = <T,>(dest: string, body: T) => {
    if (!socket.client || !socket.client.connected) {
      console.error("웹소켓에 연결되어 있지 않아 패킷을 전송할 수 없습니다.");
      return;
    }

    socket.client.publish({
      destination: dest,
      body: JSON.stringify(body),
    });
    console.log(`${dest}로 메시지 전송: ${body}`);
  };

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

  return (
    <WebSocketStateContext value={socket}>
      <WebSocketDispatchContext value={{ publishMessage }}>
        {children}
      </WebSocketDispatchContext>
    </WebSocketStateContext>
  );
};

export default WebSocketProvider;
