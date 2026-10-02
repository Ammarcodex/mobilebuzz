"use client";

import { useRef, useState } from "react";
import { removeWhiteBackground } from "@/lib/removeBackground";

export default function PhotoUploadInput({
  name,
  label,
  onProcessingChange,
}: {
  name: string;
  label: string;
  /** Lets the parent form disable submit while photos are still processing,
   * so it can't submit the original (white-background) file by racing ahead
   * of the async background removal. */
  onProcessingChange?: (processing: boolean) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [removeBg, setRemoveBg] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  function setProcessingState(value: boolean) {
    setProcessing(value);
    onProcessingChange?.(value);
  }

  async function handleChange() {
    const input = inputRef.current;
    const files = input?.files ? Array.from(input.files) : [];
    if (files.length === 0) {
      setPreviews([]);
      return;
    }

    if (!removeBg) {
      setPreviews(files.map((f) => URL.createObjectURL(f)));
      return;
    }

    setProcessingState(true);
    try {
      const processed = await Promise.all(files.map(removeWhiteBackground));
      const dataTransfer = new DataTransfer();
      for (const f of processed) dataTransfer.items.add(f);
      if (input) input.files = dataTransfer.files;
      setPreviews(processed.map((f) => URL.createObjectURL(f)));
    } finally {
      setProcessingState(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="block text-sm font-semibold text-ink">{label}</span>
      <label className="flex items-center gap-2 text-xs font-semibold text-muted">
        <input
          type="checkbox"
          checked={removeBg}
          onChange={(e) => setRemoveBg(e.target.checked)}
        />
        Remove white/plain background automatically
      </label>
      <input
        ref={inputRef}
        name={name}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
        className="input"
      />
      {processing ? (
        <p className="m-0 text-xs font-semibold text-accent">
          Removing background… please wait before saving.
        </p>
      ) : null}
      {previews.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {previews.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element -- local object URL preview, not an optimizable remote/static asset
            <img
              key={i}
              src={src}
              alt=""
              className="h-16 w-16 rounded-lg object-contain"
              style={{
                background:
                  "repeating-conic-gradient(#d8d8dc 0% 25%, #f0f0f2 0% 50%) 0 0 / 12px 12px",
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
