import "server-only";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const MAX_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/**
 * Saves an uploaded image under public/uploads/products and returns its
 * public URL path (e.g. "/uploads/products/<uuid>.jpg").
 */
export async function saveUploadedImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error("Image is too large (max 8MB).");
  }

  const ext = EXT_BY_MIME[file.type] ?? "jpg";
  const filename = `${randomUUID()}.${ext}`;

  await mkdir(UPLOAD_DIR, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return `/uploads/products/${filename}`;
}

/** Saves any non-empty image Files from formData under `fieldName`, skipping empty file inputs. */
export async function saveUploadedImages(
  formData: FormData,
  fieldName: string
): Promise<string[]> {
  const files = formData
    .getAll(fieldName)
    .filter((f): f is File => f instanceof File && f.size > 0);
  return Promise.all(files.map(saveUploadedImage));
}

/** Deletes a previously-uploaded image given its public URL path (e.g. "/uploads/products/<id>.jpg"). */
export async function deleteUploadedImage(urlPath: string): Promise<void> {
  const filename = path.basename(urlPath);
  if (!/^[\w-]+\.\w+$/.test(filename)) return; // not one of ours, ignore
  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // already gone / never existed — nothing to do
  }
}

export async function deleteUploadedImages(urlPaths: string[]): Promise<void> {
  await Promise.all(urlPaths.map(deleteUploadedImage));
}
