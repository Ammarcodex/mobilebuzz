// Client-side background removal: samples the background color from the
// photo's four corners and makes closely-matching pixels transparent, with
// a feathered edge so the cutout doesn't look jagged. This works well for
// studio product photos shot on a solid white/light background (the norm
// for phone catalog photos) — it won't help with busy or gradient
// backgrounds, since there's no real subject/background segmentation here,
// just a color-distance cutout.
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
  const { data } = imageData;

  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  for (const [x, y] of corners) {
    const i = (y * width + x) * 4;
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
  }
  r /= corners.length;
  g /= corners.length;
  b /= corners.length;

  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - r;
    const dg = data[i + 1] - g;
    const db = data[i + 2] - b;
    const distance = Math.sqrt(dr * dr + dg * dg + db * db);
    if (distance < THRESHOLD) {
      data[i + 3] = 0;
    } else if (distance < THRESHOLD + FEATHER) {
      data[i + 3] = Math.round(((distance - THRESHOLD) / FEATHER) * 255);
    }
  }

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
