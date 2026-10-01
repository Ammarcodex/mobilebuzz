"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/types";
import ProductCard from "@/components/ProductCard";

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc";

export default function ShopClient({
  products,
  categories,
  initialQuery,
}: {
  products: Product[];
  categories: Category[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");

  const brandOptions = useMemo(() => {
    if (categoryFilter === "all") {
      const seen = new Map<string, string>();
      for (const p of products) {
        if (p.brand && p.brandName && !seen.has(p.brand)) {
          seen.set(p.brand, p.brandName);
        }
      }
      return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
    }
    const category = categories.find((c) => c.slug === categoryFilter);
    return category?.brands ?? [];
  }, [categoryFilter, categories, products]);

  const filtered = useMemo(() => {
    let list = products;
    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category === categoryFilter);
    }
    if (brandFilter !== "all") {
      list = list.filter((p) => p.brand === brandFilter);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, categoryFilter, brandFilter, query, sort]);

  return (
    <div className="mx-auto max-w-[1240px] px-6 pb-16 pt-10">
      <h1 className="m-0 mb-2 text-[32px] font-extrabold tracking-tight text-ink">
        Shop All Products
      </h1>
      <p className="mb-8 text-[15px] text-muted">
        {filtered.length} of {products.length} products
      </p>

      <div className="glass mb-8 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          className="w-full rounded-full border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent sm:min-w-[180px] sm:flex-1"
        />
        <div className="grid grid-cols-2 gap-3 sm:contents">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setBrandFilter("all");
            }}
            className="w-full rounded-full border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent sm:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full rounded-full border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent sm:w-auto"
          >
            <option value="all">All Brands</option>
            {brandOptions.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="w-full rounded-full border border-black/10 bg-white/70 px-4 py-2.5 text-sm text-ink outline-none focus:border-accent sm:w-auto"
        >
          <option value="featured">Sort: Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A–Z</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-muted">
          No products match your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
