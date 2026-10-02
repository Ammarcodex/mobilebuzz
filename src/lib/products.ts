import "server-only";
import type { Collection, Document } from "mongodb";
import { getDb } from "./mongodb";
import { slugify } from "./slug";
import type { Product } from "./types";

async function getCollection(): Promise<Collection<Document>> {
  const db = await getDb();
  return db.collection("products");
}

// Images are stored inline (base64 data URIs), so a product's full photo
// gallery can be sizeable. Queries that list many products at once (grids,
// homepage strips) only ever render the single cover photo, so they project
// away the `images` array and keep just `image` — only the single-product
// page needs the full gallery.
const LIST_PROJECTION = { images: 0 } as const;

function toProduct(doc: Document): Product {
  return {
    slug: doc.slug,
    name: doc.name,
    category: doc.category ?? null,
    categoryName: doc.categoryName ?? null,
    brand: doc.brand ?? null,
    brandName: doc.brandName ?? null,
    price: doc.price,
    ram: doc.ram ?? null,
    rom: doc.rom ?? null,
    image: doc.image ?? null,
    images: doc.images ?? undefined,
    variants: doc.variants ?? undefined,
    specs: doc.specs ?? undefined,
    colors: doc.colors ?? undefined,
    storageOptions: doc.storageOptions ?? undefined,
    isHero: doc.isHero ?? undefined,
    isHotDeal: doc.isHotDeal ?? undefined,
    isFeatured: doc.isFeatured ?? undefined,
  };
}

export async function getAllProducts(): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col
    .find({}, { projection: LIST_PROJECTION })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  const col = await getCollection();
  const doc = await col.findOne({ slug });
  return doc ? toProduct(doc) : undefined;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col
    .find({ category: categorySlug }, { projection: LIST_PROJECTION })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toProduct);
}

export async function getProductsByCategoryAndBrand(
  categorySlug: string,
  brandSlug: string
): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col
    .find(
      { category: categorySlug, brand: brandSlug },
      { projection: LIST_PROJECTION }
    )
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map(toProduct);
}

/** The single product marked "Feature as Homepage Hero" in the admin, if any. */
export async function getHeroProduct(): Promise<Product | undefined> {
  const col = await getCollection();
  const doc = await col.findOne({ isHero: true }, { projection: LIST_PROJECTION });
  return doc ? toProduct(doc) : undefined;
}

/** The most recently added products, for the homepage "New Arrivals" strip. */
export async function getNewArrivalProducts(limit = 6): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col
    .find({}, { projection: LIST_PROJECTION })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(toProduct);
}

export async function getHotDealProducts(limit = 6): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col
    .find({ isHotDeal: true }, { projection: LIST_PROJECTION })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(toProduct);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const col = await getCollection();
  const docs = await col
    .find({ isFeatured: true }, { projection: LIST_PROJECTION })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  return docs.map(toProduct);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const col = await getCollection();

  const sameBrand = await col
    .find(
      {
        slug: { $ne: product.slug },
        category: product.category,
        ...(product.brand ? { brand: product.brand } : {}),
      },
      { projection: LIST_PROJECTION }
    )
    .limit(limit)
    .toArray();

  if (sameBrand.length >= limit) {
    return sameBrand.slice(0, limit).map(toProduct);
  }

  const seen = new Set(sameBrand.map((d) => d.slug as string));
  const fallback = await col
    .find(
      {
        slug: { $ne: product.slug, $nin: [...seen] },
        category: product.category,
      },
      { projection: LIST_PROJECTION }
    )
    .limit(limit - sameBrand.length)
    .toArray();

  return [...sameBrand, ...fallback].slice(0, limit).map(toProduct);
}

/** Generates a unique slug for a product name, appending -2, -3, etc. on collision. */
export async function generateUniqueSlug(name: string): Promise<string> {
  const col = await getCollection();
  const base = slugify(name) || "product";
  let candidate = base;
  let i = 2;
  while (await col.findOne({ slug: candidate })) {
    candidate = `${base}-${i}`;
    i += 1;
  }
  return candidate;
}

export async function createProduct(product: Product): Promise<void> {
  const col = await getCollection();
  const now = new Date();
  await col.insertOne({ ...product, createdAt: now, updatedAt: now });
  if (product.isHero) await clearHeroExcept(product.slug);
}

export async function updateProduct(
  slug: string,
  product: Product
): Promise<void> {
  const col = await getCollection();
  await col.updateOne(
    { slug },
    { $set: { ...product, updatedAt: new Date() } }
  );
  if (product.isHero) await clearHeroExcept(slug);
}

/** At most one product can be the homepage hero; unset the flag on every other product. */
async function clearHeroExcept(slug: string): Promise<void> {
  const col = await getCollection();
  await col.updateMany(
    { slug: { $ne: slug }, isHero: true },
    { $set: { isHero: false } }
  );
}

export async function deleteProduct(slug: string): Promise<void> {
  const col = await getCollection();
  await col.deleteOne({ slug });
}
