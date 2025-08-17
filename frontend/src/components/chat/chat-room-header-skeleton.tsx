const ChatRoomHeaderSkeleton = () => {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-500 dark:bg-neutral-800">
      <div className="flex flex-1 items-center gap-4">
        <div className="size-10 shrink-0 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />

        <div className="flex w-full flex-col gap-1">
          <div className="h-5 w-full max-w-96 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />

          <div className="flex items-center gap-1">
            <div className="size-4 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
            <div className="h-4 w-8 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
          </div>
        </div>
      </div>

      <div className="size-7 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-600" />
    </div>
  );
};

export default ChatRoomHeaderSkeleton;
