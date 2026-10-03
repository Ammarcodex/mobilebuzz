export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-10">
      <div className="skeleton mb-6 h-4 w-64 rounded-full" />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <div className="skeleton h-[300px] rounded-[32px] sm:h-[380px]" />
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton h-16 w-16 rounded-xl" />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <div className="skeleton mb-2 h-3 w-24 rounded-full" />
            <div className="skeleton h-8 w-4/5 rounded-full" />
          </div>
          <div className="skeleton h-9 w-40 rounded-full" />
          <div>
            <div className="skeleton mb-2 h-4 w-20 rounded-full" />
            <div className="flex gap-2">
              <div className="skeleton h-10 w-24 rounded-full" />
              <div className="skeleton h-10 w-24 rounded-full" />
            </div>
          </div>
          <div className="skeleton h-14 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
}
