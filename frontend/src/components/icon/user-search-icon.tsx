import type { IconProps } from "@/types/icon/type";

const UserSearchIcon = ({ className }: IconProps) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}>
      <path
        d="M8.33335 10.8333C10.6345 10.8333 12.5 8.96785 12.5 6.66667C12.5 4.36548 10.6345 2.5 8.33335 2.5C6.03217 2.5 4.16669 4.36548 4.16669 6.66667C4.16669 8.96785 6.03217 10.8333 8.33335 10.8333Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M1.66667 17.5C1.66677 16.4508 1.9145 15.4165 2.38972 14.481C2.86494 13.5456 3.55423 12.7356 4.40152 12.1168C5.24882 11.498 6.23021 11.088 7.26587 10.92C8.30153 10.752 9.36222 10.8308 10.3617 11.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M15 17.5C16.3807 17.5 17.5 16.3807 17.5 15C17.5 13.6193 16.3807 12.5 15 12.5C13.6193 12.5 12.5 13.6193 12.5 15C12.5 16.3807 13.6193 17.5 15 17.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
      <path
        d="M18.3333 18.3333L16.75 16.75"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  );
};

export default UserSearchIcon;
