"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { categories } from "@/lib/data";
import { BUSINESS } from "@/lib/format";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  ...categories.map((c) => ({
    href: `/product-category/${c.slug}`,
    label: c.name,
  })),
  { href: "/installment-procedure", label: "Installments" },
];

function CartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function CountBadge({ n }: { n: number }) {
  if (n <= 0) return null;
  return (
    <span className="absolute -top-0.5 -right-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full bg-accent-orange text-[9px] font-bold text-white">
      {n > 9 ? "9+" : n}
    </span>
  );
}

export default function Header() {
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  return (
    <header>
      {/* Thin contact strip */}
      <div className="mx-auto hidden max-w-[1240px] items-center justify-end gap-5 px-6 pt-2.5 text-xs text-muted md:flex">
        <a
          href={BUSINESS.phonePrimaryHref}
          className="foot-link flex items-center gap-1.5"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          {BUSINESS.phonePrimary}
        </a>
        <span className="h-3 w-px bg-[#d2d2d7]" />
        <span>Cash on Delivery · Installments up to 12 months</span>
      </div>

      {/* Floating glass nav */}
      <div className="sticky top-4 z-40 mx-auto max-w-[1200px] px-6">
        <div className="glass flex items-center gap-7 rounded-[22px] px-5 py-2.5">
          {searchOpen ? (
            <form
              onSubmit={handleSearch}
              className="flex w-full items-center gap-3"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 text-muted"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
              <button
                type="button"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="icon-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/50 text-ink"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </form>
          ) : (
            <>
              <Link href="/" aria-label="Mobile Buzz home" className="flex items-center">
                <Logo />
              </Link>

              <nav
                aria-label="Main"
                className="hidden flex-grow flex-wrap gap-5 lg:flex"
              >
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="nav-link text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="ml-auto flex flex-grow items-center justify-end gap-2 lg:flex-grow-0">
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  className="icon-btn flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
                <Link
                  href="/wishlist"
                  aria-label={`Wishlist, ${wishlistCount} items`}
                  className="icon-btn relative flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink"
                >
                  <HeartIcon />
                  <CountBadge n={wishlistCount} />
                </Link>
                <Link
                  href="/cart"
                  aria-label={`Cart, ${cartCount} items`}
                  className="icon-btn relative flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink"
                >
                  <CartIcon />
                  <CountBadge n={cartCount} />
                </Link>
                <button
                  type="button"
                  aria-label="Toggle menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="icon-btn flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink lg:hidden"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 12h18M3 6h18M3 18h18" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {menuOpen ? (
          <div className="glass mt-2 flex flex-col gap-1 rounded-2xl p-4 lg:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="nav-link rounded-lg px-2 py-2 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </header>
  );
}
