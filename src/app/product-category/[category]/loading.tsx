import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-10">
      <div className="skeleton mb-4 h-4 w-40 rounded-full" />
      <div className="skeleton mb-1 h-9 w-56 rounded-full" />
      <div className="skeleton mb-6 h-5 w-28 rounded-full" />
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="skeleton h-10 w-24 rounded-full" />
        ))}
      </div>
      <ProductGridSkeleton count={8} />
    </div>
  );
}
