import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories } from "@/lib/data";
import { getProductsByCategory } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  return { title: cat?.name ?? "Category" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = categories.find((c) => c.slug === category);
  if (!cat) notFound();

  const items = await getProductsByCategory(category);

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-10">
      <div className="mb-4">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: cat.name }]}
        />
      </div>
      <h1 className="m-0 mb-1 text-[32px] font-extrabold tracking-tight text-ink">
        {cat.name}
      </h1>
      <p className="mb-6 text-[15px] text-muted">
        {items.length} product{items.length === 1 ? "" : "s"}
      </p>

      {cat.brands && cat.brands.length > 0 ? (
        <div className="mb-8 flex flex-wrap gap-2">
          {cat.brands.map((b) => (
            <Link
              key={b.slug}
              href={`/product-category/${cat.slug}/${b.slug}`}
              className="glass pill-glass rounded-full px-4 py-2 text-sm font-semibold text-ink"
            >
              {b.name}
            </Link>
          ))}
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-muted">
          <p className="mb-2 text-lg font-bold text-ink">Coming Soon</p>
          <p className="m-0">
            We don&apos;t have {cat.name.toLowerCase()} in stock right now —
            check back soon, or browse our smartphones in the meantime.
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
