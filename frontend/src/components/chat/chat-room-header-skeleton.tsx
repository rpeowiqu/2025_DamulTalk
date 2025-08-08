const ChatRoomHeaderSkeleton = () => {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-neutral-200 bg-white px-6 py-4 dark:border-neutral-500 dark:bg-neutral-800">
      <div className="flex flex-1 items-center gap-4">
        <div className="size-12 shrink-0 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />

        <div className="flex flex-col gap-1">
          <div className="h-5 w-72 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
          <div className="h-4 w-12 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
        </div>
      </div>

      <div className="flex items-center gap-5 text-neutral-500">
        <div className="size-8 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-600" />
        <div className="size-8 shrink-0 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-600" />
      </div>
    </div>
  );
};

export default ChatRoomHeaderSkeleton;
