"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";

export default function WishlistPage() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-20 text-center">
        <h1 className="m-0 mb-3 text-3xl font-extrabold text-ink">
          Your Wishlist is Empty
        </h1>
        <p className="mb-6 text-muted">
          Tap the heart icon on any product to save it here.
        </p>
        <Link
          href="/shop"
          className="pill-solid inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1000px] px-6 pb-16 pt-10">
      <h1 className="m-0 mb-8 text-3xl font-extrabold tracking-tight text-ink">
        Your Wishlist
      </h1>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.slug} className="glass flex flex-col overflow-hidden rounded-3xl">
            <Link
              href={`/product/${item.slug}`}
              className="flex h-[180px] items-center justify-center p-6"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  width={140}
                  height={140}
                  unoptimized
                  className="max-h-full max-w-full object-contain"
                />
              ) : null}
            </Link>
            <div className="flex flex-col gap-2 p-4">
              <Link href={`/product/${item.slug}`} className="font-bold text-ink hover:text-accent">
                {item.name}
              </Link>
              <span className="font-extrabold text-ink">
                {formatPrice(item.price)}
              </span>
              <div className="mt-1 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      key: item.slug,
                      slug: item.slug,
                      name: item.name,
                      image: item.image,
                      price: item.price,
                    })
                  }
                  className="pill-solid flex-1 rounded-full bg-accent px-4 py-2 text-xs font-bold text-white"
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  aria-label={`Remove ${item.name} from wishlist`}
                  onClick={() => removeItem(item.slug)}
                  className="icon-btn flex h-9 w-9 items-center justify-center rounded-full subtle-surface text-muted"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
