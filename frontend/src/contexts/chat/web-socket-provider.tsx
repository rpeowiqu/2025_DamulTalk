import { createContext, useEffect, useRef, type ReactNode } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const WebSocketContext = createContext<Client | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    clientRef.current = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_BASE_URL),
      onConnect: () => {
        console.log("WebSocket connected!");
      },
      onDisconnect: () => {
        console.log("WebSocket disconnected.");
      },
    });
    clientRef.current.activate();

    return () => {
      clientRef.current?.deactivate();
    };
  }, []);

  return (
    <WebSocketContext value={clientRef.current}>{children}</WebSocketContext>
  );
};

export default WebSocketProvider;
