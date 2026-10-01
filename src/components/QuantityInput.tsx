"use client";

export default function QuantityInput({
  value,
  onChange,
  min = 1,
  max = 99,
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  function clamp(n: number) {
    return Math.max(min, Math.min(max, n));
  }

  return (
    <div className="glass flex items-center rounded-full">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-ink disabled:opacity-30"
        disabled={value <= min}
      >
        −
      </button>
      <input
        type="number"
        aria-label="Quantity"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
        className="w-10 border-none bg-transparent text-center text-sm font-semibold text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-10 w-10 items-center justify-center text-lg font-semibold text-ink disabled:opacity-30"
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}
