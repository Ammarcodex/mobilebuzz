"use client";

import Image from "next/image";
import type { BrandLogo } from "@/lib/types";

// Most logos here are flat dark/grayscale marks, so crushing them to pure
// black then inverting makes a crisp white version for dark mode. That trick
// breaks for logos where it erases real internal contrast instead of just
// flipping light/dark:
//  - Samsung's white wordmark sits directly on top of its blue oval at the
//    same opacity, so brightness(0) flattens both to identical black and the
//    text disappears into the oval. Its natural blue/white already reads
//    fine on both light and dark panels, so it gets no filter at all.
//  - Nokia's mark is already near-white, so the normal filter (which only
//    fires in dark mode) leaves it invisible against the light panel. It
//    needs the opposite: invert for light mode, stay natural in dark mode.
const LOGO_FILTER_OVERRIDES: Record<string, string> = {
  Samsung: "",
  Nokia: "invert dark:invert-0",
};
const DEFAULT_LOGO_FILTER = "dark:brightness-0 dark:invert";

export default function BrandMarquee({ brands }: { brands: BrandLogo[] }) {
  // Rendered twice back-to-back so the marquee animation (which scrolls
  // exactly one set's width) loops seamlessly with no visible jump.
  const track = [...brands, ...brands];

  return (
    <div className="glass overflow-hidden rounded-[30px] p-7">
      <div className="brand-marquee-track flex w-max items-center gap-12">
        {track.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex h-10 shrink-0 items-center justify-center"
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              width={90}
              height={40}
              unoptimized
              className={`max-h-full w-auto object-contain ${
                LOGO_FILTER_OVERRIDES[brand.name] ?? DEFAULT_LOGO_FILTER
              }`}
              // These logos are hot-linked from a third-party site; if one
              // occasionally fails to load, hide it rather than showing a
              // broken-image icon in the middle of the ticker.
              onError={(e) => {
                e.currentTarget.style.visibility = "hidden";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
