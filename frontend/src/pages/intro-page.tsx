import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { debounce } from "lodash-es";

import Button from "@/components/common/button";
import messageImage from "@/assets/images/message.png";
import backgroundImage from "@/assets/images/food-pattern.png";
import { cn } from "@/utils/style";

const IntroPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const handleScroll = useMemo(
    () =>
      debounce(() => {
        if (!containerRef.current) {
          return;
        }

        setIsScrolled(containerRef.current.scrollTop > 10);
      }, 100),
    [],
  );

  const handleClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.addEventListener("scroll", handleScroll);
    return () => {
      containerRef.current?.removeEventListener("scroll", handleScroll);
      handleScroll.cancel();
    };
  }, [handleScroll]);

  return (
    <div
      ref={containerRef}
      className="flex h-dvh w-full snap-y snap-mandatory flex-col items-center overflow-y-scroll">
      <img
        src={backgroundImage}
        alt="배경 이미지"
        className="pointer-events-none absolute z-0 size-full object-cover pr-[15px] opacity-2.5"
      />

      <div className="pointer-events-none sticky top-0 z-9999 h-20 w-full shrink-0 snap-start">
        <header
          className={cn(
            "flex w-full justify-center border-b border-neutral-200 transition-all duration-200",
            isScrolled ? "h-16 bg-white" : "bg-damul-main-300 h-full",
          )}>
          <div className="flex min-w-[80rem] items-center justify-between">
            <h1
              className={cn(
                "text-4xl font-extrabold select-none",
                isScrolled ? "text-damul-main-300" : "text-white",
              )}>
              DamulTalk
            </h1>
            <Button
              className={cn(
                "pointer-events-auto rounded-full bg-transparent",
                isScrolled && "text-damul-main-300 hover:text-white",
              )}
              onClick={handleClick}>
              시작하기
            </Button>
          </div>
        </header>
      </div>

      <section className="z-10 flex h-220 w-full shrink-0 flex-col items-center justify-center gap-12">
        <motion.div
          animate={{
            opacity: [0, 1],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-2">
          <p className="text-damul-main-400 text-2xl font-bold">
            팀50일의 멤버가 다시 모여 개발한
          </p>
          <h1 className="text-5xl font-black">웹소켓 기반의 메신저 서비스</h1>
        </motion.div>

        <motion.div
          animate={{
            opacity: [0, 1],
          }}
          transition={{
            delay: 0.6,
            duration: 1,
            ease: "easeInOut",
          }}>
          <motion.img
            animate={{
              y: [-6, 0, 6, 0, -6],
            }}
            transition={{
              delay: 0.7,
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
            src={messageImage}
            alt="메시지 이미지"
            className="size-96 object-cover select-none"
          />
        </motion.div>
      </section>

      <section className="z-20 flex h-240 shrink-0 snap-start flex-col gap-8 pt-28">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 1, once: true }}>
          <h1 className="text-4xl font-black">💬 채팅 기능</h1>
          <ul className="flex flex-col gap-1 pl-12">
            <li className="list-disc text-xl text-neutral-500">
              텍스트, 이미지, 비디오 등 다양한 메시지를 주고 받을 수 있어요
            </li>
            <li className="list-disc text-xl text-neutral-500">
              나에게 온 메시지를 알림으로 알려줘요
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="w-[64rem]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}>
          <video
            src="/public/chat-simulation.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="size-full rounded-xl object-cover shadow-xl"
          />
        </motion.div>
      </section>

      <section className="z-20 flex h-240 snap-start flex-col gap-8 pt-28">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 1, once: true }}>
          <h1 className="text-4xl font-black">🏠️ 당신만의 소통 공간</h1>
          <ul className="flex flex-col gap-1 pl-12">
            <li className="list-disc text-xl text-neutral-500">
              다양한 사람들과 친구를 맺고 대화를 시작해 보세요
            </li>
            <li className="list-disc text-xl text-neutral-500">
              프로필 이미지, 배경 이미지, 상태 메시지를 설정하고 자유롭게
              프로필을 꾸며보세요
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="w-[64rem]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}>
          <video
            src="/public/profile-simulation.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="size-full rounded-xl object-cover shadow-xl"
          />
        </motion.div>
      </section>

      <footer className="z-9999 mt-52 flex w-full items-center justify-center bg-neutral-50 py-12">
        <div className="flex w-[80rem] flex-col gap-4">
          <h1
            className={cn(
              "text-4xl font-extrabold select-none",
              isScrolled ? "text-damul-main-300" : "text-white",
            )}>
            DamulTalk
          </h1>

          <div className="flex flex-1 items-center justify-between text-sm text-neutral-400">
            <p>© All rights reserved to 50DAYS 2025</p>

            <div className="flex gap-4">
              <p className="cursor-pointer">개인정보 처리방침</p>
              <p className="cursor-pointer">이용약관</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default IntroPage;
