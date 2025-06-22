import { useEffect, useRef, useState } from "react";

export const useScrollMove = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  const triggerScroll = () => {
    setShouldScroll(true);
  };

  useEffect(() => {
    if (shouldScroll) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setShouldScroll(false);
    }
  }, [shouldScroll]);

  return {
    bottomRef,
    triggerScroll,
  };
};
