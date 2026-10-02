"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyAdminCredentials, verifyAdminSession } from "@/lib/auth";
import { createAdminSession, deleteAdminSession } from "@/lib/session";
import {
  createProduct,
  deleteProduct,
  generateUniqueSlug,
  getProductBySlug,
  updateProduct,
} from "@/lib/products";
import { deleteUploadedImages, saveUploadedImages } from "@/lib/uploads";
import { slugify } from "@/lib/slug";
import type { Product, ProductColor, Spec, StorageOption } from "@/lib/types";

export interface LoginFormState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Username and password are required." };
  }

  let valid: boolean;
  try {
    valid = await verifyAdminCredentials(username, password);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Admin login is not configured.",
    };
  }
  if (!valid) {
    return { error: "Invalid username or password." };
  }

  await createAdminSession(username);
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await deleteAdminSession();
  redirect("/admin/login");
}

export interface ProductFormState {
  error?: string;
}

function productErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error)) return fallback;
  if (/bsonobj size|document.{0,20}too large/i.test(error.message)) {
    return "This product's photos add up to too much data to save — remove a photo or use smaller/fewer images.";
  }
  return error.message;
}

function parseJsonArray<T>(formData: FormData, field: string): T[] {
  const raw = formData.get(field);
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}

async function buildProductFromFormData(
  formData: FormData,
  existingImages: string[]
): Promise<Product> {
  const name = String(formData.get("name") ?? "").trim();
  const categorySlug = String(formData.get("category") ?? "").trim() || null;
  const categoryName =
    String(formData.get("categoryName") ?? "").trim() || null;
  const brandNameRaw = String(formData.get("brand") ?? "").trim();
  const price = Number(formData.get("price") ?? 0) || 0;
  const ram = String(formData.get("ram") ?? "").trim() || null;
  const rom = String(formData.get("rom") ?? "").trim() || null;

  if (!name) {
    throw new Error("Product name is required.");
  }

  const removedImages = new Set(formData.getAll("removeImages").map(String));
  const keptImages = existingImages.filter((img) => !removedImages.has(img));
  const newImages = await saveUploadedImages(formData, "images");
  const images = [...keptImages, ...newImages];

  if (removedImages.size > 0) {
    await deleteUploadedImages(existingImages.filter((img) => removedImages.has(img)));
  }

  const specs = parseJsonArray<Spec>(formData, "specsJson").filter(
    (s) => s.label?.trim() && s.value?.trim()
  );
  const colors = parseJsonArray<ProductColor>(formData, "colorsJson").filter(
    (c) => c.name?.trim() && c.hex?.trim()
  );
  const storageOptions = parseJsonArray<StorageOption>(
    formData,
    "storageOptionsJson"
  )
    .filter((o) => o.label?.trim())
    .map((o) => ({ label: o.label.trim(), price: Number(o.price) || 0 }));

  return {
    slug: "", // set by caller
    name,
    category: categorySlug,
    categoryName,
    brand: brandNameRaw ? slugify(brandNameRaw) : null,
    brandName: brandNameRaw || null,
    price,
    ram,
    rom,
    image: images[0] ?? null,
    images,
    specs,
    colors,
    storageOptions,
    isHero: formData.get("isHero") === "on",
    isHotDeal: formData.get("isHotDeal") === "on",
    isFeatured: formData.get("isFeatured") === "on",
  };
}

export async function createProductAction(
  _prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  await verifyAdminSession();

  try {
    const draft = await buildProductFromFormData(formData, []);
    const slug = await generateUniqueSlug(draft.name);
    await createProduct({ ...draft, slug });
  } catch (error) {
    return { error: productErrorMessage(error, "Failed to create product.") };
  }

  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin");
}

export async function updateProductAction(
  _prevState: ProductFormState | undefined,
  formData: FormData
): Promise<ProductFormState> {
  await verifyAdminSession();

  const originalSlug = String(formData.get("originalSlug") ?? "").trim();
  if (!originalSlug) {
    return { error: "Missing product reference." };
  }

  try {
    const existing = await getProductBySlug(originalSlug);
    if (!existing) {
      return { error: "Product not found." };
    }

    const draft = await buildProductFromFormData(
      formData,
      existing.images && existing.images.length > 0
        ? existing.images
        : existing.image
          ? [existing.image]
          : []
    );
    await updateProduct(originalSlug, { ...draft, slug: originalSlug });
  } catch (error) {
    return { error: productErrorMessage(error, "Failed to update product.") };
  }

  revalidatePath("/shop");
  revalidatePath("/");
  revalidatePath(`/product/${originalSlug}`);
  redirect("/admin");
}

export async function deleteProductAction(formData: FormData): Promise<void> {
  await verifyAdminSession();
  const slug = String(formData.get("slug") ?? "").trim();
  if (!slug) return;

  const existing = await getProductBySlug(slug);
  await deleteProduct(slug);

  if (existing) {
    const images =
      existing.images && existing.images.length > 0
        ? existing.images
        : existing.image
          ? [existing.image]
          : [];
    await deleteUploadedImages(images);
  }

  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin");
}
