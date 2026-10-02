"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import QuantityInput from "@/components/QuantityInput";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[900px] px-6 py-20 text-center">
        <h1 className="m-0 mb-3 text-3xl font-extrabold text-ink">
          Your Cart is Empty
        </h1>
        <p className="mb-6 text-muted">
          Browse our smartphones and add something you love.
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
        Your Cart
      </h1>

      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <div
            key={item.key}
            className="glass flex flex-col gap-4 rounded-3xl p-4 sm:flex-row sm:items-center sm:p-5"
          >
            <div className="flex items-center gap-4">
              <div className="photo-surface flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={64}
                    height={64}
                    unoptimized
                    className="max-h-16 max-w-16 object-contain"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/product/${item.slug}`}
                  className="font-bold text-ink hover:text-accent"
                >
                  {item.name}
                </Link>
                {item.variantLabel ? (
                  <div className="text-xs text-muted">{item.variantLabel}</div>
                ) : null}
                <div className="mt-1 text-sm font-semibold text-ink">
                  {formatPrice(item.price)}
                </div>
              </div>
              <button
                type="button"
                aria-label={`Remove ${item.name} from cart`}
                onClick={() => removeItem(item.key)}
                className="icon-btn flex h-9 w-9 shrink-0 items-center justify-center rounded-full subtle-surface text-muted sm:hidden"
              >
                <svg
                  width="15"
                  height="15"
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
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <QuantityInput
                value={item.quantity}
                onChange={(q) => updateQuantity(item.key, q)}
              />
              <div className="w-24 text-right font-bold text-ink sm:w-28">
                {formatPrice(item.price * item.quantity)}
              </div>
              <button
                type="button"
                aria-label={`Remove ${item.name} from cart`}
                onClick={() => removeItem(item.key)}
                className="icon-btn hidden h-9 w-9 shrink-0 items-center justify-center rounded-full subtle-surface text-muted sm:flex"
              >
                <svg
                  width="15"
                  height="15"
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
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col items-end gap-4">
        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-semibold text-muted hover:text-accent-orange"
        >
          Clear Cart
        </button>
        <div className="glass w-full max-w-sm rounded-3xl p-6 sm:w-auto">
          <div className="mb-4 flex items-center justify-between gap-8 text-lg">
            <span className="font-semibold text-ink">Subtotal</span>
            <span className="font-extrabold text-ink">
              {formatPrice(subtotal)}
            </span>
          </div>
          <Link
            href="/checkout"
            className="pill-solid block rounded-full bg-accent px-8 py-3.5 text-center text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)]"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
