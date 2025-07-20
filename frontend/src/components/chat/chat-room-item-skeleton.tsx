const ChatRoomItemSkeleton = () => {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl bg-white p-2">
      <div className="size-12 shrink-0 animate-pulse rounded-xl bg-neutral-200" />

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex gap-3">
          <div className="h-5 flex-1 animate-pulse rounded-xl bg-neutral-200" />
          <div className="flex items-center gap-1">
            <div className="size-4 animate-pulse rounded-xl bg-neutral-200" />
            <div className="h-4 w-8 animate-pulse rounded-xl bg-neutral-200" />
          </div>
        </div>

        <div className="h-5 w-full animate-pulse rounded-xl bg-neutral-200" />
      </div>
    </div>
  );
};

export default ChatRoomItemSkeleton;
