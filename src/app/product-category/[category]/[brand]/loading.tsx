import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-10">
      <div className="skeleton mb-4 h-4 w-52 rounded-full" />
      <div className="skeleton mb-1 h-9 w-64 rounded-full" />
      <div className="skeleton mb-8 h-5 w-28 rounded-full" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
