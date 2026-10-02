import "server-only";

// Images are stored inline in MongoDB as data URIs rather than in external
// object storage. Kept modest (1MB raw per photo) since every photo rides
// along in its product document (and, for the cover photo, in any query
// that lists several products at once — see the projections in products.ts
// that drop the full gallery for list views).
const MAX_SIZE_BYTES = 1 * 1024 * 1024; // 1MB

export async function saveUploadedImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new Error(
      `"${file.name}" is too large (max 1MB per photo) — compress or resize it and try again.`
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
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

// Images live inline in the product document (not external storage), so
// removing/replacing one is just dropping it from the document — nothing
// external to clean up. Kept as no-ops (same signature) so callers don't
// need to change.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteUploadedImage(_url: string): Promise<void> {}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteUploadedImages(_urls: string[]): Promise<void> {}
