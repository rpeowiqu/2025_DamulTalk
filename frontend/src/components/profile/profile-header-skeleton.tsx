const ProfileHeaderSkeleton = () => {
  return (
    <div>
      <div className="h-54 animate-pulse rounded-xl bg-neutral-200 object-cover" />

      <div className="flex h-16 items-end gap-4 px-10">
        <div className="size-28 animate-pulse rounded-full bg-neutral-200" />

        <div className="flex flex-col gap-2">
          <div className="h-6 w-48 animate-pulse rounded-xl bg-neutral-200 font-bold" />
          <div className="h-4 w-16 animate-pulse rounded-xl bg-neutral-200 font-bold" />
        </div>
      </div>
    </div>
  );
};

export default ProfileHeaderSkeleton;
