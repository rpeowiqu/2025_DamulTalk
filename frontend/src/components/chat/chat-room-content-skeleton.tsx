const ChatRoomContentSkeleton = () => {
  return (
    <div className="flex h-full flex-col p-6 pb-0">
      <div className="min-h-0 flex-1" />
      <div className="sticky bottom-0 z-10 bg-neutral-50 pb-6">
        <div className="h-40 animate-pulse rounded-xl bg-neutral-200"></div>
      </div>
    </div>
  );
};

export default ChatRoomContentSkeleton;
