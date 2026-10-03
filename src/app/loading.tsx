import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div>
      {/* Hero */}
      <div className="mx-auto max-w-[1440px] px-6 pt-10">
        <div className="glass grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[40px] p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div className="flex flex-col gap-5">
            <div className="skeleton h-3 w-24 rounded-full" />
            <div className="skeleton h-11 w-full rounded-full" />
            <div className="skeleton h-5 w-4/5 rounded-full" />
            <div className="mt-2 flex flex-wrap gap-3">
              <div className="skeleton h-12 w-40 rounded-full" />
              <div className="skeleton h-12 w-44 rounded-full" />
            </div>
          </div>
          <div className="skeleton h-[300px] rounded-[28px]" />
        </div>
      </div>

      {/* Category tiles */}
      <div className="mx-auto max-w-[1440px] px-6 pt-12">
        <div className="grid grid-cols-2 gap-[18px] lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-28 rounded-[22px]" />
          ))}
        </div>
      </div>

      {/* New Arrivals */}
      <div className="mx-auto max-w-[1440px] px-6 pt-14">
        <div className="mb-[22px] flex items-baseline justify-between">
          <div className="skeleton h-7 w-44 rounded-full" />
          <div className="skeleton h-4 w-16 rounded-full" />
        </div>
        <ProductGridSkeleton
          count={3}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        />
      </div>
    </div>
  );
}
