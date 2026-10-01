import type { Spec } from "@/lib/types";

export default function SpecsList({ specs }: { specs: Spec[] }) {
  if (!specs || specs.length === 0) return null;
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <dl className="divide-y divide-black/[0.06]">
        {specs.map((spec, i) => (
          <div
            key={`${spec.label}-${i}`}
            className="grid grid-cols-[1fr_1.4fr] gap-4 px-5 py-3 text-sm sm:px-6"
          >
            <dt className="font-semibold text-ink">{spec.label}</dt>
            <dd className="m-0 text-muted">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
