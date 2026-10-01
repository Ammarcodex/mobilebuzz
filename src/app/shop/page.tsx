import type { Metadata } from "next";
import { categories } from "@/lib/data";
import { getAllProducts } from "@/lib/products";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await getAllProducts();
  return (
    <ShopClient
      products={products}
      categories={categories}
      initialQuery={q ?? ""}
    />
  );
}
