"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product, StorageOption } from "@/lib/types";
import { getDisplayPrice } from "@/lib/format";
import PriceTag from "./PriceTag";
import QuantityInput from "./QuantityInput";
import InstallmentCalculator from "./InstallmentCalculator";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { toggleItem, isWishlisted } = useWishlist();
  const { showToast } = useToast();
  const [storageIndex, setStorageIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const hasColors = !!product.colors && product.colors.length > 0;

  // Sort cheapest-first so the default selection (and display order) is the
  // lowest-priced tier rather than whatever order the admin entered them in.
  const sortedStorageOptions = useMemo(
    () => [...(product.storageOptions ?? [])].sort((a, b) => a.price - b.price),
    [product.storageOptions]
  );
  const hasStorageOptions = sortedStorageOptions.length > 0;

  const selectedStorage = hasStorageOptions ? sortedStorageOptions[storageIndex] : undefined;
  const selectedColor = hasColors ? product.colors![colorIndex] : undefined;

  const effectivePrice = selectedStorage?.price ?? product.price;
  const effectiveRam = selectedStorage?.ram ?? product.ram;
  const effectiveRom = selectedStorage?.rom ?? product.rom;

  const wishlisted = isWishlisted(product.slug);

  // Only call out PTA status (on buttons and in the cart line item) once the
  // admin has actually listed a non-PTA option somewhere — otherwise every
  // button would redundantly say "(PTA Approved)" with nothing to contrast it against.
  const hasNonPtaOption = sortedStorageOptions.some(
    (o) => o.ptaStatus === "non-pta"
  );
  const ptaLabel = (status: StorageOption["ptaStatus"]) =>
    status === "non-pta" ? "Non-PTA" : "PTA Approved";

  const storageVariantLabel = selectedStorage
    ? `${selectedStorage.ram} - ${selectedStorage.rom}`
    : undefined;
  const variantLabel = [
    storageVariantLabel,
    hasNonPtaOption ? ptaLabel(selectedStorage?.ptaStatus) : undefined,
    selectedColor?.name,
  ]
    .filter(Boolean)
    .join(" / ");

  function handleAddToCart() {
    const key = variantLabel ? `${product.slug}::${variantLabel}` : product.slug;
    addItem(
      {
        key,
        slug: product.slug,
        name: product.name,
        image: product.image,
        price: effectivePrice,
        variantLabel: variantLabel || undefined,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  function handleWishlist() {
    const willBeWishlisted = !wishlisted;
    toggleItem({
      slug: product.slug,
      name: product.name,
      image: product.image,
      price: getDisplayPrice(product),
    });
    showToast(
      willBeWishlisted
        ? `Added "${product.name}" to wishlist`
        : `Removed "${product.name}" from wishlist`
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline gap-3">
        <PriceTag price={effectivePrice} className="text-2xl" />
        {(effectiveRam || effectiveRom) && (
          <span className="text-sm text-muted">
            {effectiveRam ? `${effectiveRam} RAM` : ""}
            {effectiveRam && effectiveRom ? " · " : ""}
            {effectiveRom ? `${effectiveRom} Storage` : ""}
          </span>
        )}
        {hasNonPtaOption && selectedStorage ? (
          <span
            className={`pill-glass glass rounded-full px-2.5 py-1 text-xs font-bold ${
              selectedStorage.ptaStatus === "non-pta"
                ? "text-accent-orange"
                : "text-accent"
            }`}
          >
            {ptaLabel(selectedStorage.ptaStatus)}
          </span>
        ) : null}
      </div>

      {hasStorageOptions ? (
        <div>
          <span className="mb-2 block text-sm font-semibold text-ink">
            Storage
          </span>
          <div className="flex flex-wrap gap-2">
            {sortedStorageOptions.map((option, i) => (
              <button
                key={`${option.ram}-${option.rom}-${i}`}
                type="button"
                onClick={() => setStorageIndex(i)}
                className={`pill-solid rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  i === storageIndex
                    ? "bg-accent text-white"
                    : "pill-glass glass text-ink"
                }`}
              >
                {option.ram} - {option.rom}
                {hasNonPtaOption ? (
                  <span className="ml-1 text-[10px] font-semibold opacity-80">
                    ({ptaLabel(option.ptaStatus)})
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {hasColors ? (
        <div>
          <span className="mb-2 block text-sm font-semibold text-ink">
            Color{selectedColor ? `: ${selectedColor.name}` : ""}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {product.colors!.map((color, i) => (
              <button
                key={`${color.name}-${i}`}
                type="button"
                onClick={() => setColorIndex(i)}
                aria-label={color.name}
                title={color.name}
                className={`h-9 w-9 rounded-full border-2 transition-transform ${
                  i === colorIndex
                    ? "scale-110 border-accent"
                    : "border-white/70"
                }`}
                style={{ background: color.hex }}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <span className="mb-2 block text-sm font-semibold text-ink">
          Quantity
        </span>
        <QuantityInput value={quantity} onChange={setQuantity} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="pill-solid rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)]"
        >
          Add to Cart
        </button>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="icon-btn glass flex h-12 w-12 items-center justify-center rounded-full"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={wishlisted ? "#f2653f" : "none"}
            stroke={wishlisted ? "#f2653f" : "currentColor"}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
        {justAdded ? (
          <span className="text-sm font-semibold text-accent">
            Added to cart!
          </span>
        ) : null}
      </div>

      {justAdded ? (
        <Link
          href="/cart"
          className="text-sm font-semibold text-accent hover:underline"
        >
          View Cart →
        </Link>
      ) : null}

      <InstallmentCalculator price={effectivePrice} />
    </div>
  );
}
