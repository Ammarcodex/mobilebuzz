import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-10">
      <div className="skeleton mb-2 h-9 w-72 rounded-full" />
      <div className="skeleton mb-8 h-5 w-40 rounded-full" />
      <div className="skeleton mb-8 h-[52px] w-full rounded-3xl" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
