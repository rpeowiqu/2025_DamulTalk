const ChatRoomContentSkeleton = () => {
  return (
    <div className="flex h-full flex-col p-6 pb-0">
      <div className="min-h-0 flex-1" />
      <div className="sticky bottom-0 z-10 bg-neutral-50 pb-6 dark:bg-neutral-700">
        <div className="h-40 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-600" />
      </div>
    </div>
  );
};

export default ChatRoomContentSkeleton;
