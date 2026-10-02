import Link from "next/link";
import Image from "next/image";
import { categories, brands } from "@/lib/data";
import {
  getFeaturedProducts,
  getHeroProduct,
  getHotDealProducts,
  getNewArrivalProducts,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import BrandMarquee from "@/components/BrandMarquee";
import TypewriterText from "@/components/TypewriterText";
import Reveal from "@/components/Reveal";
import { formatPrice, getDisplayPrice } from "@/lib/format";
import { INSTALLMENT_PLANS } from "@/lib/installment";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [heroPick, newArrivals, hotDeals, featured] = await Promise.all([
    getHeroProduct(),
    getNewArrivalProducts(6),
    getHotDealProducts(6),
    getFeaturedProducts(6),
  ]);
  // Fall back to the most recent arrival so the hero banner is never empty
  // before an admin has explicitly picked one.
  const hero = heroPick ?? newArrivals[0];

  return (
    <div>
      {/* Hero */}
      <div className="mx-auto max-w-[1240px] px-6 pt-10">
        <div className="glass grid grid-cols-1 items-center gap-10 overflow-hidden rounded-[40px] p-8 sm:p-12 lg:grid-cols-2 lg:p-16">
          <div className="flex flex-col gap-5">
            <span
              className="hero-in text-[13px] font-bold tracking-[0.05em] text-accent"
              style={{ "--hero-in-delay": "0ms" } as React.CSSProperties}
            >
              {hero ? "NEW ARRIVAL" : "WELCOME"}
            </span>
            <h1
              className="hero-in m-0 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl"
              style={{ "--hero-in-delay": "80ms" } as React.CSSProperties}
            >
              <TypewriterText
                text={
                  hero
                    ? `The ${hero.name} has arrived.`
                    : "Genuine Phones, Great Prices."
                }
              />
            </h1>
            <p
              className="hero-in m-0 max-w-[440px] text-[17px] leading-[1.6] text-muted"
              style={{ "--hero-in-delay": "160ms" } as React.CSSProperties}
            >
              Genuine smartphones and smartwatches in Karachi — cash on
              delivery, plus easy monthly installments up to 12 months.
            </p>
            <div
              className="hero-in mt-2 flex flex-wrap gap-3"
              style={{ "--hero-in-delay": "240ms" } as React.CSSProperties}
            >
              {hero ? (
                <Link
                  href={`/product/${hero.slug}`}
                  className="pill-solid rounded-full bg-accent px-7 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)]"
                >
                  Shop {hero.brandName ?? hero.name}
                </Link>
              ) : null}
              <Link
                href="/product-category/smartphone"
                className="pill-glass glass rounded-full px-7 py-3.5 text-sm font-bold text-ink"
              >
                Browse Smartphones
              </Link>
            </div>
            <div
              className="hero-in mt-3.5 flex flex-wrap gap-2.5"
              style={{ "--hero-in-delay": "320ms" } as React.CSSProperties}
            >
              {["Cash on Delivery", "12-Month Installments", "100% Genuine"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="glass flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-[#3a3a3d] dark:text-[#e5e5ea]"
                  >
                    {chip}
                  </span>
                )
              )}
            </div>
          </div>
          <div
            className="hero-in photo-surface relative flex items-center justify-center rounded-[28px] p-6"
            style={{ "--hero-in-delay": "120ms" } as React.CSSProperties}
          >
            {hero?.image ? (
              <Image
                src={hero.image}
                alt={hero.name}
                width={320}
                height={360}
                unoptimized
                className="max-h-[340px] max-w-[300px] object-contain"
                style={{
                  filter: "drop-shadow(0 30px 40px rgba(0,113,227,0.25))",
                }}
              />
            ) : null}
            <span className="glass absolute right-2 top-2 rounded-full px-4 py-2 text-xs font-bold text-[#b45716]">
              {formatPrice(hero ? getDisplayPrice(hero) : 0)}
            </span>
          </div>
        </div>
      </div>

      {/* Category tiles */}
      <Reveal className="mx-auto max-w-[1240px] px-6 pt-12">
        <div className="grid grid-cols-2 gap-[18px] lg:grid-cols-4">
          {categories.map((category) => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </Reveal>

      {/* New Arrivals */}
      {newArrivals.length > 0 ? (
        <Section title="New Arrivals" href="/shop">
          <ProductGrid>
            {newArrivals.map((p) => (
              <ProductCard key={p.slug} product={p} badge="new" />
            ))}
          </ProductGrid>
        </Section>
      ) : null}

      {/* Today's Hot Deals */}
      {hotDeals.length > 0 ? (
        <Section title="Today's Hot Deals" href="/shop">
          <ProductGrid>
            {hotDeals.map((p) => (
              <ProductCard key={p.slug} product={p} badge="hot" />
            ))}
          </ProductGrid>
        </Section>
      ) : null}

      {/* Installment banner */}
      <Reveal className="mx-auto mt-14 max-w-[1240px] px-6">
        <div className="glass-dark flex flex-wrap items-center justify-between gap-6 rounded-[32px] p-9">
          <div className="flex items-center gap-4.5">
            <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-2xl bg-white/10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </span>
            <div>
              <h3 className="m-0 mb-1 text-xl font-extrabold text-white">
                Buy Now, Pay Later
              </h3>
              <p className="m-0 text-[13px] text-white/65">
                Easy monthly installments on every smartphone — no bank card
                required.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {INSTALLMENT_PLANS.map((plan) => (
              <div
                key={plan.months}
                className="rounded-full border border-white/[0.14] bg-white/[0.08] px-5 py-2.5 text-center"
              >
                <div className="text-sm font-extrabold text-white">
                  {plan.months}mo
                </div>
              </div>
            ))}
          </div>
          <Link
            href="/installment-procedure"
            className="pill-solid whitespace-nowrap rounded-full bg-accent-orange px-6 py-3 text-[13px] font-bold text-white"
          >
            Installment Procedure
          </Link>
        </div>
      </Reveal>

      {/* Featured Products */}
      {featured.length > 0 ? (
        <Section title="Featured Products" href="/shop">
          <ProductGrid>
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </ProductGrid>
        </Section>
      ) : null}

      {/* Brand strip */}
      <Reveal className="mx-auto max-w-[1240px] px-6 pt-14">
        <h2 className="m-0 mb-6 text-center text-xl font-extrabold text-ink">
          Our Authorized Brands
        </h2>
        <BrandMarquee brands={brands} />
      </Reveal>
    </div>
  );
}

function Section({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal className="mx-auto max-w-[1240px] px-6 pt-14">
      <div className="mb-[22px] flex items-baseline justify-between">
        <h2 className="m-0 text-[28px] font-extrabold tracking-tight text-ink">
          {title}
        </h2>
        <Link href={href} className="text-sm font-bold text-ink hover:text-accent">
          View All ›
        </Link>
      </div>
      {children}
    </Reveal>
  );
}

function ProductGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {children}
    </div>
  );
}
