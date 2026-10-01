"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { createLocalStorageStore } from "@/lib/localStorageStore";

export interface WishlistItem {
  slug: string;
  name: string;
  image: string | null;
  price: number;
}

interface WishlistContextValue {
  items: WishlistItem[];
  toggleItem: (item: WishlistItem) => void;
  removeItem: (slug: string) => void;
  isWishlisted: (slug: string) => boolean;
  count: number;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

const wishlistStore = createLocalStorageStore<WishlistItem[]>(
  "mobile-buzz-wishlist",
  []
);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(
    wishlistStore.subscribe,
    wishlistStore.getSnapshot,
    wishlistStore.getServerSnapshot
  );

  const toggleItem = useCallback((item: WishlistItem) => {
    wishlistStore.set((prev) => {
      const exists = prev.some((i) => i.slug === item.slug);
      return exists
        ? prev.filter((i) => i.slug !== item.slug)
        : [...prev, item];
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    wishlistStore.set((prev) => prev.filter((i) => i.slug !== slug));
  }, []);

  const isWishlisted = useCallback(
    (slug: string) => items.some((i) => i.slug === slug),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      toggleItem,
      removeItem,
      isWishlisted,
      count: items.length,
    }),
    [items, toggleItem, removeItem, isWishlisted]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx)
    throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
