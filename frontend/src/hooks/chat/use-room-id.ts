import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const useRoomId = () => {
  // useParams 훅으로 얻어온 roomId를 사용할 경우 subscription에서 클로저로 캡처되어 문제가 발생하므로, useLocation + useEffect + useRef로 동적 경로 설정
  const roomIdRef = useRef<number>(0);
  const location = useLocation();

  useEffect(() => {
    const match = location.pathname.match(/^\/chats\/(\d+)/);
    roomIdRef.current = match ? Number(match[1]) : 0;
  }, [location.pathname]);

  return roomIdRef;
};

export default useRoomId;
