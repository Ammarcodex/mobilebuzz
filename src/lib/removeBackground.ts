// Client-side background removal: samples the background color from the
// photo's border and flood-fills inward from the edges, making only pixels
// *connected* to the border through a chain of background-colored pixels
// transparent (with a feathered edge so the cutout doesn't look jagged).
//
// Flood-filling from the border (rather than a plain global color-distance
// cutoff) matters a lot for white/silver phones shot on a white background:
// the product itself is then nearly the same color as the background, so a
// global cutoff erases chunks of the product too. A flood fill can't "jump"
// into the product unless the product's own edge is also indistinguishable
// from the background — in practice there's always at least a faint edge or
// shadow line separating them, which is enough to stop the fill.
//
// This still won't help with busy or gradient backgrounds, since there's no
// real subject/background segmentation here, just a color-distance cutout.
//
// Also downsizes to a sane max dimension and re-encodes as WebP (which,
// unlike JPEG, supports transparency) to keep the result small enough for
// the 1MB-per-photo cap in lib/uploads.ts.

const MAX_DIMENSION = 1000;
const THRESHOLD = 44;
const FEATHER = 34;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

/** Mutates `data`'s alpha channel in place. Pure pixel math, no DOM/Canvas
 * dependency, so it can be unit-tested outside a browser. */
export function cutoutBackground(
  data: Uint8ClampedArray,
  width: number,
  height: number
): void {
  if (width <= 0 || height <= 0) return;

  // Average the full border (not just the 4 corners) for a more reliable
  // background color sample.
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const addSample = (x: number, y: number) => {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    n++;
  };
  for (let x = 0; x < width; x++) {
    addSample(x, 0);
    addSample(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    addSample(0, y);
    addSample(width - 1, y);
  }
  r /= n;
  g /= n;
  b /= n;

  const colorDistance = (i: number) => {
    const dr = data[i] - r;
    const dg = data[i + 1] - g;
    const db = data[i + 2] - b;
    return Math.sqrt(dr * dr + dg * dg + db * db);
  };

  // Flood fill from every border pixel through connected background-colored
  // pixels. A stack-based (DFS) fill avoids recursion depth limits on large
  // images; fill order doesn't matter for the result.
  const visited = new Uint8Array(width * height);
  const isBackground = new Uint8Array(width * height);
  const stack: number[] = [];

  const visit = (x: number, y: number) => {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = y * width + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    if (colorDistance(idx * 4) < THRESHOLD + FEATHER) {
      isBackground[idx] = 1;
      stack.push(idx);
    }
  };

  for (let x = 0; x < width; x++) {
    visit(x, 0);
    visit(x, height - 1);
  }
  for (let y = 0; y < height; y++) {
    visit(0, y);
    visit(width - 1, y);
  }

  while (stack.length > 0) {
    const idx = stack.pop() as number;
    const x = idx % width;
    const y = (idx / width) | 0;
    visit(x + 1, y);
    visit(x - 1, y);
    visit(x, y + 1);
    visit(x, y - 1);
  }

  for (let idx = 0; idx < isBackground.length; idx++) {
    if (!isBackground[idx]) continue;
    const i = idx * 4;
    const distance = colorDistance(i);
    data[i + 3] =
      distance < THRESHOLD
        ? 0
        : Math.round(((distance - THRESHOLD) / FEATHER) * 255);
  }
}

async function process(file: File): Promise<File> {
  const img = await loadImage(file);

  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;

  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  cutoutBackground(imageData.data, width, height);
  ctx.putImageData(imageData, 0, 0);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.85)
  );
  if (!blob) return file;

  return new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
    type: "image/webp",
  });
}

/**
 * Never rejects: if anything goes wrong (image fails to decode, canvas is
 * tainted, etc.) this falls back to the original file rather than leaving
 * the caller's Promise.all to reject and silently abort the whole upload.
 */
export async function removeWhiteBackground(file: File): Promise<File> {
  try {
    return await process(file);
  } catch (err) {
    console.warn("Background removal failed, using original photo:", err);
    return file;
  }
}
