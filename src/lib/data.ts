import rawCategories from "@/data/categories.json";
import rawBrands from "@/data/brands.json";
import type { Category, BrandLogo } from "./types";

export const categories = rawCategories as unknown as Category[];
export const brands = rawBrands as unknown as BrandLogo[];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
