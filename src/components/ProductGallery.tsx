"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="glass flex h-[300px] items-center justify-center rounded-[32px] p-8 sm:h-[380px] sm:p-10">
        {current ? (
          <Image
            src={current}
            alt={name}
            width={380}
            height={380}
            unoptimized
            className="max-h-[260px] max-w-full object-contain sm:max-h-[320px]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            No image available
          </div>
        )}
      </div>

      {images.length > 1 ? (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show photo ${i + 1} of ${name}`}
              className={`glass flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl p-2 ${
                i === active ? "ring-2 ring-accent" : ""
              }`}
            >
              <Image
                src={img}
                alt=""
                width={44}
                height={44}
                unoptimized
                className="max-h-full max-w-full object-contain"
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
