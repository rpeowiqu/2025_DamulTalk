import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { debounce } from "lodash-es";

import Button from "@/components/common/button";
import messageImage from "@/assets/images/message.png";
import backgroundImage from "@/assets/images/food-pattern.png";
import { cn } from "@/utils/style";
import ThemeChangeButton from "@/components/theme/theme-change-button";

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
        className="pointer-events-none fixed inset-0 z-0 size-full object-cover pr-[var(--scrollbar-width)] opacity-3 dark:opacity-3"
      />

      <div className="pointer-events-none sticky top-0 z-9999 h-20 w-full shrink-0 snap-start">
        <header
          className={cn(
            "flex w-full justify-center shadow-sm transition-all duration-200",
            isScrolled
              ? "h-16 bg-white dark:bg-neutral-800"
              : "bg-damul-main-300 dark:bg-damul-main-500 h-full",
          )}>
          <nav className="flex w-full max-w-[80rem] items-center justify-between px-6">
            <h1
              className={cn(
                "text-2xl font-extrabold select-none md:text-4xl",
                isScrolled ? "text-damul-main-300" : "text-white",
              )}>
              DamulTalk
            </h1>
            <div className="flex items-center gap-4">
              <ThemeChangeButton
                className={cn(
                  "pointer-events-auto size-5 md:size-6",
                  isScrolled && "text-damul-main-300",
                )}
              />
              <Button
                className={cn(
                  "dark:hover:bg-damul-main-400 pointer-events-auto rounded-full bg-transparent px-3 dark:bg-transparent",
                  isScrolled &&
                    "text-damul-main-300 dark:text-damul-main-300 dark:hover:bg-damul-main-400 py-2 hover:text-white dark:hover:text-white",
                )}
                onClick={handleClick}>
                시작하기
              </Button>
            </div>
          </nav>
        </header>
      </div>

      <section className="z-10 flex h-dvh min-h-fit w-full shrink-0 flex-col items-center justify-center gap-12 pt-[var(--intro-header-height)]">
        <motion.div
          animate={{
            opacity: [0, 1],
          }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-2">
          <p className="text-damul-main-400 dark:text-damul-main-300 font-bold sm:text-xl lg:text-2xl">
            팀50일의 멤버가 다시 모여 개발한
          </p>
          <h1 className="text-2xl font-black sm:text-4xl lg:text-5xl dark:text-white">
            웹소켓 기반의 메신저 서비스
          </h1>
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
            className="size-64 object-cover select-none sm:size-80 lg:size-96"
          />
        </motion.div>
      </section>

      <section className="z-10 flex h-dvh min-h-fit shrink-0 snap-start flex-col justify-center gap-8 px-6 pt-[var(--intro-header-height)]">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 1, once: true }}>
          <h1 className="text-xl font-black sm:text-3xl lg:text-4xl dark:text-white">
            💬 채팅 기능
          </h1>
          <ul className="flex flex-col gap-1 pl-12">
            <li className="list-disc text-sm text-neutral-500 sm:text-base lg:text-xl dark:text-neutral-200">
              텍스트, 이미지, 비디오 등 다양한 메시지를 주고 받을 수 있어요
            </li>
            <li className="list-disc text-sm text-neutral-500 sm:text-base lg:text-xl dark:text-neutral-200">
              나에게 온 메시지를 알림으로 알려줘요
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="w-full max-w-[64rem]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}>
          <video
            src={`${import.meta.env.VITE_VIDEO_BASE_URL}chat-simulation.mp4`}
            autoPlay
            muted
            loop
            playsInline
            className="size-full rounded-xl object-cover shadow-xl"
          />
        </motion.div>
      </section>

      <section className="z-10 flex h-dvh min-h-fit shrink-0 snap-start flex-col justify-center gap-8 px-6 pt-[var(--intro-header-height)]">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ amount: 1, once: true }}>
          <h1 className="text-xl font-black sm:text-3xl lg:text-4xl dark:text-white">
            🏠️ 당신만의 소통 공간
          </h1>
          <ul className="flex flex-col gap-1 pl-12">
            <li className="list-disc text-sm text-neutral-500 sm:text-base lg:text-xl dark:text-neutral-200">
              다양한 사람들과 친구를 맺고 대화를 시작해 보세요
            </li>
            <li className="list-disc text-sm text-neutral-500 sm:text-base lg:text-xl dark:text-neutral-200">
              프로필 이미지, 배경 이미지, 상태 메시지를 설정하고 자유롭게
              프로필을 꾸며보세요
            </li>
          </ul>
        </motion.div>

        <motion.div
          className="w-full max-w-[64rem]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}>
          <video
            src={`${import.meta.env.VITE_VIDEO_BASE_URL}profile-simulation.mp4`}
            autoPlay
            muted
            loop
            playsInline
            className="size-full rounded-xl object-cover shadow-xl"
          />
        </motion.div>
      </section>

      <footer className="z-9999 mt-52 flex w-full items-center justify-center bg-neutral-50 px-6 py-12 dark:bg-neutral-800">
        <div className="flex w-[80rem] flex-col gap-4">
          <h1
            className={cn(
              "text-2xl font-extrabold select-none md:text-4xl",
              isScrolled ? "text-damul-main-300" : "text-white",
            )}>
            DamulTalk
          </h1>

          <div className="flex flex-1 flex-col items-start justify-between gap-2 text-sm text-neutral-400 md:flex-row md:items-center md:gap-0 dark:text-neutral-100">
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
