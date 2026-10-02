/** Placeholder cards matching ProductCard's shape, shown by loading.tsx
 * while a product grid is being fetched from the database. */
export default function ProductGridSkeleton({
  count = 8,
  className = "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="glass flex flex-col overflow-hidden rounded-[26px]"
        >
          <div className="skeleton h-[210px] rounded-t-[26px]" />
          <div className="flex flex-grow flex-col gap-2 p-[18px]">
            <div className="skeleton h-3 w-16 rounded-full" />
            <div className="skeleton h-4 w-3/4 rounded-full" />
            <div className="mt-auto flex items-center justify-between pt-2">
              <div className="skeleton h-5 w-24 rounded-full" />
              <div className="skeleton h-[38px] w-[38px] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
