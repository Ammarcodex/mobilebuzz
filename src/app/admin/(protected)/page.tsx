import Image from "next/image";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { formatPrice, getDisplayPrice } from "@/lib/format";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminDashboardPage() {
  const products = await getAllProducts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="m-0 text-2xl font-extrabold tracking-tight text-ink">
            Products
          </h1>
          <p className="m-0 text-sm text-muted">
            {products.length} phone{products.length === 1 ? "" : "s"} in the
            catalog
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="pill-solid rounded-full bg-accent px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)]"
        >
          + Add New Phone
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-muted">
          No products yet. Add your first phone to get started.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((product) => (
            <div
              key={product.slug}
              className="glass flex flex-wrap items-center gap-4 rounded-2xl p-4"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white/90">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={52}
                    height={52}
                    unoptimized
                    className="max-h-[52px] max-w-[52px] object-contain"
                  />
                ) : (
                  <span className="text-[10px] text-muted">No image</span>
                )}
              </div>

              <div className="min-w-[160px] flex-1">
                <div className="font-bold text-ink">{product.name}</div>
                <div className="text-xs text-muted">
                  {product.brandName ?? "—"} · {product.categoryName ?? "—"}
                </div>
              </div>

              <div className="w-28 text-sm font-semibold text-ink">
                {formatPrice(getDisplayPrice(product))}
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/${product.slug}/edit`}
                  className="pill-glass glass rounded-full px-4 py-2 text-xs font-bold text-ink"
                >
                  Edit
                </Link>
                <DeleteProductButton slug={product.slug} name={product.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
