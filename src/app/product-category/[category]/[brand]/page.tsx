import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data";
import { getProductsByCategoryAndBrand } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}): Promise<Metadata> {
  const { category, brand } = await params;
  const cat = categories.find((c) => c.slug === category);
  const brandEntry = cat?.brands?.find((b) => b.slug === brand);
  return { title: brandEntry ? `${brandEntry.name} ${cat?.name}` : "Brand" };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ category: string; brand: string }>;
}) {
  const { category, brand } = await params;
  const cat = categories.find((c) => c.slug === category);
  const brandEntry = cat?.brands?.find((b) => b.slug === brand);
  if (!cat || !brandEntry) notFound();

  const items = await getProductsByCategoryAndBrand(category, brand);

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-10">
      <div className="mb-4">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: cat.name, href: `/product-category/${cat.slug}` },
            { label: brandEntry.name },
          ]}
        />
      </div>
      <h1 className="m-0 mb-1 text-[32px] font-extrabold tracking-tight text-ink">
        {brandEntry.name} {cat.name}
      </h1>
      <p className="mb-8 text-[15px] text-muted">
        {items.length} product{items.length === 1 ? "" : "s"}
      </p>

      {items.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-muted">
          <p className="mb-2 text-lg font-bold text-ink">Coming Soon</p>
          <p className="m-0">
            We don&apos;t have {brandEntry.name} {cat.name.toLowerCase()} in
            stock right now — check back soon.
          </p>
          <Link
            href="/shop"
            className="pill-solid mt-5 inline-block rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
