import Link from "next/link";
import type { Category } from "@/lib/types";

const ICONS: Record<string, React.ReactNode> = {
  smartphone: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#0071e3" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M11 18h2" />
    </svg>
  ),
  laptops: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M2 20h20" />
    </svg>
  ),
  tablet: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6e6e73" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="14" rx="1" />
      <path d="M9 21h6" />
    </svg>
  ),
  smartwatches: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f2653f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="4" width="10" height="16" rx="3" />
      <path d="M10 1h4" />
    </svg>
  ),
  accessories: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#f2653f" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

export default function CategoryCard({ category }: { category: Category }) {
  const empty = category.count === 0;
  const iconBg = category.slug === "smartphone" || category.slug === "smartwatches"
    ? category.slug === "smartphone" ? "rgba(0,113,227,0.12)" : "rgba(242,101,63,0.14)"
    : "var(--subtle-surface)";

  return (
    <Link
      href={`/product-category/${category.slug}`}
      className={`glass glass-card relative block rounded-[26px] p-[26px] ${
        empty ? "opacity-70" : ""
      }`}
    >
      {empty ? (
        <span
          className="absolute right-[18px] top-[18px] rounded-full px-[9px] py-1 text-[10px] font-bold text-muted"
          style={{ background: "var(--subtle-surface-strong)" }}
        >
          SOON
        </span>
      ) : null}
      <div
        className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl"
        style={{ background: iconBg }}
      >
        {ICONS[category.slug] ?? ICONS.smartphone}
      </div>
      <h3 className="m-0 mb-0.5 text-base font-bold text-ink">
        {category.name}
      </h3>
      <p className="m-0 text-[13px] text-muted">
        {category.count} product{category.count === 1 ? "" : "s"}
      </p>
    </Link>
  );
}
