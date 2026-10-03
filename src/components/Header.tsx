"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useCart } from "@/context/CartContext";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  // Apple-style squeeze: the nav bar compacts its padding/gap and the logo
  // shrinks slightly once the page has scrolled past the very top.
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  }

  // Dynamic-Island-style fold: once scrolled, the pill itself narrows down
  // to just the logo + icon cluster (nav links fold away, reachable via the
  // menu button instead) and expands back the moment you scroll back up.
  // Suppressed while search is open so the input isn't squeezed narrow.
  const islandCollapsed = scrolled && !searchOpen;

  // Traveling liquid-glass indicator behind the nav links: tracks whichever
  // link is currently hovered and glides to match its position/width,
  // rather than each link independently fading its own background in.
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [hoverRect, setHoverRect] = useState<{ left: number; width: number } | null>(
    null
  );

  function handleLinkHover(e: React.MouseEvent<HTMLAnchorElement>) {
    const navEl = navRef.current;
    if (!navEl) return;
    const linkRect = e.currentTarget.getBoundingClientRect();
    const navRect = navEl.getBoundingClientRect();
    setHoverRect({ left: linkRect.left - navRect.left, width: linkRect.width });
  }

  // The page you're actually on keeps its own indicator showing even when
  // the mouse isn't over the nav at all — only an active *hover* elsewhere
  // temporarily takes over and replaces it, rather than the pill just
  // vanishing the moment you stop hovering.
  const pathname = usePathname();
  const activeHref = NAV_LINKS.find((link) =>
    link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)
  )?.href;
  const [activeRect, setActiveRect] = useState<{ left: number; width: number } | null>(
    null
  );

  useEffect(() => {
    function measureActive() {
      const navEl = navRef.current;
      const activeEl = activeHref ? linkRefs.current[activeHref] : null;
      if (!navEl || !activeEl) {
        setActiveRect(null);
        return;
      }
      const linkRect = activeEl.getBoundingClientRect();
      const navRect = navEl.getBoundingClientRect();
      setActiveRect({ left: linkRect.left - navRect.left, width: linkRect.width });
    }
    measureActive();
    window.addEventListener("resize", measureActive);
    return () => window.removeEventListener("resize", measureActive);
  }, [activeHref, islandCollapsed]);

  const indicatorRect = hoverRect ?? activeRect;

  return (
    <header
      // position:sticky must live on <header> itself, not a div nested inside
      // it: a sticky element can't stick past the bottom of its own parent,
      // and a wrapper div here would be no taller than its own content (just
      // this nav strip), leaving it no room to stay pinned while scrolling.
      // <header>'s real parent is the page's full-height wrapper, which is.
      className={`sticky z-40 transition-[top] duration-300 ease-out ${
        scrolled ? "top-2" : "top-4"
      }`}
    >
      {/* Thin contact strip — collapses away as part of the scroll squeeze */}
      <div
        className={`mx-auto hidden max-w-[1440px] items-center justify-end gap-5 overflow-hidden px-6 text-xs text-muted transition-[max-height,opacity,padding] duration-300 ease-out md:flex ${
          scrolled ? "max-h-0 py-0 opacity-0" : "max-h-10 pt-2.5 opacity-100"
        }`}
      >
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
        <span className="h-3 w-px bg-[#d2d2d7] dark:bg-white/15" />
        <span>Cash on Delivery · Installments up to 12 months</span>
      </div>

      {/* Floating glass nav */}
      <div className="mx-auto max-w-[1400px] px-6">
        <div
          className={`nav-glass mx-auto flex items-center overflow-hidden rounded-[22px] ${
            islandCollapsed
              ? "max-w-[460px] gap-3 px-4 py-2"
              : scrolled
                ? "max-w-full gap-5 px-4 py-1.5"
                : "max-w-full gap-7 px-5 py-2.5"
          }`}
        >
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
                className="icon-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/50 text-ink dark:bg-white/10"
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
                <span
                  className={`flex origin-left items-center transition-transform duration-300 ease-out ${
                    scrolled ? "scale-90" : "scale-100"
                  }`}
                >
                  <Logo />
                </span>
              </Link>

              <nav
                ref={navRef}
                aria-label="Main"
                onMouseLeave={() => setHoverRect(null)}
                className={`relative hidden flex-grow flex-nowrap items-center gap-1 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-out lg:flex ${
                  islandCollapsed ? "max-w-0 opacity-0" : "max-w-[800px] opacity-100"
                }`}
              >
                {/* Traveling liquid-glass indicator — glides to whichever
                    link is hovered, or otherwise sits under whatever page
                    you're actually on, rather than vanishing when the mouse
                    isn't over the nav. */}
                <div
                  aria-hidden="true"
                  className="nav-pill-indicator"
                  style={{
                    opacity: indicatorRect ? 1 : 0,
                    width: indicatorRect?.width ?? 0,
                    transform: `translateX(${indicatorRect?.left ?? 0}px)`,
                  }}
                />
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    ref={(el) => {
                      linkRefs.current[link.href] = el;
                    }}
                    onMouseEnter={handleLinkHover}
                    className={`nav-pill-link relative z-10 text-sm font-medium ${
                      link.href === activeHref ? "text-accent" : ""
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="ml-auto flex flex-grow items-center justify-end gap-2 lg:flex-grow-0">
                <ThemeToggle />
                <button
                  type="button"
                  aria-label="Search"
                  onClick={() => setSearchOpen(true)}
                  className="icon-btn flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink dark:bg-white/10"
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
                  href="/cart"
                  aria-label={`Cart, ${cartCount} items`}
                  className="icon-btn relative flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink dark:bg-white/10"
                >
                  <CartIcon />
                  <CountBadge n={cartCount} />
                </Link>
                {/* Mobile: unchanged — always opens the link dropdown, at
                    any scroll position. */}
                <button
                  type="button"
                  aria-label="Toggle menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="icon-btn flex h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink dark:bg-white/10 lg:hidden"
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

                {/* Desktop, only once the island has collapsed: instead of a
                    dropdown, this scrolls back to the top — which also
                    expands the pill back out, since that's what un-collapses
                    it in the first place. */}
                <button
                  type="button"
                  aria-label="Back to top"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`icon-btn hidden h-9 w-9 items-center justify-center rounded-full bg-white/50 text-ink dark:bg-white/10 ${
                    islandCollapsed ? "lg:flex" : ""
                  }`}
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
                    <path d="M12 19V5M5 12l7-7 7 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>

        {menuOpen ? (
          <div
            className={`nav-glass mx-auto mt-2 flex flex-col gap-1 rounded-2xl p-4 ${
              islandCollapsed ? "max-w-[460px]" : "lg:hidden"
            }`}
          >
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
