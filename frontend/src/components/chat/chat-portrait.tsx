import UserPortrait from "@/components/community/user-portrait";

interface ChatPortraitProps {
  profileImageUrls: (string | null)[];
  unreadMessageNum?: number;
}

const ChatPortrait = ({
  profileImageUrls,
  unreadMessageNum,
}: ChatPortraitProps) => {
  return (
    <div className="relative flex size-12 shrink-0 flex-wrap items-center justify-center">
      {profileImageUrls.length === 1 ? (
        <UserPortrait />
      ) : (
        [0, 1].map((row) =>
          [0, 1].map((col) => {
            const index = 2 * row + col;

            return (
              index <= profileImageUrls.length - 1 && (
                <UserPortrait
                  key={index}
                  profileImageUrl={profileImageUrls[index]}
                  className="size-6"
                />
              )
            );
          }),
        )
      )}

      {unreadMessageNum !== undefined && unreadMessageNum > 0 && (
        <div className="absolute top-0 right-0 flex size-4 items-center justify-center rounded-full bg-red-500 text-[0.625rem] text-white">
          {unreadMessageNum > 9 ? "9+" : unreadMessageNum}
        </div>
      )}
    </div>
  );
};

export default ChatPortrait;
