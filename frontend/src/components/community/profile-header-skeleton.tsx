const ProfileHeaderSkeleton = () => {
  return (
    <header>
      <div className="h-36 animate-pulse rounded-xl bg-neutral-200 object-cover md:h-54 dark:bg-neutral-600" />

      <div className="flex h-12 items-end gap-4 px-6 md:h-16 md:px-10">
        <div className="bg-neutral-20 size-16 shrink-0 animate-pulse rounded-full bg-neutral-200 md:size-28 dark:bg-neutral-600" />

        <div className="flex w-full flex-col gap-2">
          <div className="h-6 w-full max-w-48 animate-pulse rounded-xl bg-neutral-200 font-bold dark:bg-neutral-600" />
          <div className="h-4 w-full max-w-12 animate-pulse rounded-xl bg-neutral-200 font-bold dark:bg-neutral-600" />
        </div>
      </div>
    </header>
  );
};

export default ProfileHeaderSkeleton;
