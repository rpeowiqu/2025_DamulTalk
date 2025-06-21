import type { IconProps } from "@/types/icon/type";

const ChatIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M4 16C2.53334 16 1.33334 14.8 1.33334 13.3333V6.66667C1.33334 5.2 2.53334 4 4 4H14.6667C16.1333 4 17.3333 5.2 17.3333 6.66667V13.3333C17.3333 14.8 16.1333 16 14.6667 16H12V20L8 16H4ZM28 24C29.4667 24 30.6667 22.8 30.6667 21.3333V14.6667C30.6667 13.2 29.4667 12 28 12H20V13.3333C20 16.2667 17.6 18.6667 14.6667 18.6667V21.3333C14.6667 22.8 15.8667 24 17.3333 24H20V28L24 24H28Z"
        fill="currentColor"
        className={className}
      />
    </svg>
  );
};

export default ChatIcon;
