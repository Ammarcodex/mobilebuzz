import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import Breadcrumbs from "@/components/Breadcrumbs";
import ProductGallery from "@/components/ProductGallery";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import SpecsList from "@/components/SpecsList";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);
  const gallery = product.images && product.images.length > 0
    ? product.images
    : product.image
      ? [product.image]
      : [];

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-16 pt-10">
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            product.categoryName
              ? { label: product.categoryName, href: `/product-category/${product.category}` }
              : { label: "Shop", href: "/shop" },
            ...(product.brandName && product.category && product.brand
              ? [
                  {
                    label: product.brandName,
                    href: `/product-category/${product.category}/${product.brand}`,
                  },
                ]
              : []),
            { label: product.name },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={gallery} name={product.name} />

        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.05em] text-subtle">
              {product.brandName ?? product.categoryName}
            </div>
            <h1 className="m-0 text-3xl font-extrabold tracking-tight text-ink">
              {product.name}
            </h1>
          </div>

          <ProductPurchasePanel product={product} />
        </div>
      </div>

      {product.specs && product.specs.length > 0 ? (
        <div className="mt-14">
          <h2 className="m-0 mb-5 text-2xl font-extrabold tracking-tight text-ink">
            Full Specifications
          </h2>
          <SpecsList specs={product.specs} />
        </div>
      ) : null}

      {related.length > 0 ? (
        <div className="mt-14">
          <h2 className="m-0 mb-5 text-2xl font-extrabold tracking-tight text-ink">
            Related Products
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
