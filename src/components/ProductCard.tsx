"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { getDisplayPrice } from "@/lib/format";
import PriceTag from "./PriceTag";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export default function ProductCard({
  product,
  badge,
}: {
  product: Product;
  badge?: "new" | "hot" | "featured";
}) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const wishlisted = isWishlisted(product.slug);
  // Homepage sections pass an explicit badge ("new" for New Arrivals, "hot"
  // for the Hot Deals strip); everywhere else (shop grid, category pages,
  // related products) derive it from the product's own admin-set flags so
  // hot deal/featured items are still called out wherever they appear.
  const effectiveBadge =
    badge ?? (product.isHotDeal ? "hot" : product.isFeatured ? "featured" : undefined);
  const accent =
    effectiveBadge === "hot"
      ? "#f2653f"
      : effectiveBadge === "featured"
        ? "#f5a623"
        : "#0071e3";
  const badgeLabel =
    effectiveBadge === "hot"
      ? "HOT DEAL"
      : effectiveBadge === "featured"
        ? "FEATURED"
        : "NEW";
  const displayPrice = getDisplayPrice(product);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem({
      key: product.slug,
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: displayPrice,
    });
    showToast(`Added "${product.name}" to cart`, "success");
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    const willBeWishlisted = !wishlisted;
    toggleItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: displayPrice,
    });
    showToast(
      willBeWishlisted
        ? `Added "${product.name}" to wishlist`
        : `Removed "${product.name}" from wishlist`
    );
  }

  return (
    <Link
      href={`/product/${product.slug}`}
      className="glass glass-card flex flex-col overflow-hidden rounded-[26px]"
    >
      <div className="relative flex h-[210px] items-center justify-center rounded-t-[26px] bg-white/90 p-5">
        {effectiveBadge ? (
          <span
            className="absolute left-3.5 top-3.5 rounded-full px-2.5 py-1 text-[11px] font-bold text-white"
            style={{ background: accent }}
          >
            {badgeLabel}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={`${wishlisted ? "Remove" : "Add"} ${product.name} ${
            wishlisted ? "from" : "to"
          } wishlist`}
          onClick={handleWishlist}
          className="icon-btn absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-[#3a3a3d]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#f2653f" : "none"}
            stroke={wishlisted ? "#f2653f" : "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            width={220}
            height={220}
            className="max-h-full max-w-full object-contain"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-grow flex-col gap-1.5 p-[18px]">
        <div className="text-[11px] font-semibold uppercase tracking-[0.05em] text-subtle">
          {product.brandName ?? product.categoryName ?? "Mobile Buzz"}
        </div>
        <h3 className="m-0 text-[15px] font-bold text-ink">{product.name}</h3>
        {product.colors && product.colors.length > 0 ? (
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 5).map((color, i) => (
              <span
                key={`${color.name}-${i}`}
                title={color.name}
                className="h-3 w-3 rounded-full border border-black/10"
                style={{ background: color.hex }}
              />
            ))}
            {product.colors.length > 5 ? (
              <span className="text-[11px] text-subtle">
                +{product.colors.length - 5}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag price={displayPrice} />
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={handleAddToCart}
            className="cart-btn flex h-[38px] w-[38px] items-center justify-center rounded-full text-white"
            style={{ background: accent }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
}
