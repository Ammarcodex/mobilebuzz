export interface ProductVariant {
  attributes: Record<string, string>;
  price: number | string | null;
  image: string | null;
  sku: string | null;
}

export interface Spec {
  label: string;
  value: string;
}

/** A selectable color swatch. `image` optionally overrides the product photo. */
export interface ProductColor {
  name: string;
  hex: string;
  image?: string | null;
}

/**
 * A selectable RAM+Storage configuration (e.g. "8GB / 128GB" vs "12GB / 256GB"),
 * each with its own full price. Shown as a button labeled "{ram} - {rom}".
 * The same RAM+Storage combo can appear twice with different `ptaStatus` to
 * offer separate PTA-approved and non-PTA pricing. Missing/legacy options are
 * treated as PTA-approved.
 */
export interface StorageOption {
  ram: string;
  rom: string;
  price: number;
  ptaStatus?: "pta" | "non-pta";
}

export interface Product {
  slug: string;
  name: string;
  category: string | null;
  categoryName: string | null;
  brand: string | null;
  brandName: string | null;
  price: number;
  ram: string | null;
  rom: string | null;
  image: string | null;
  images?: string[];
  variants?: ProductVariant[];
  specs?: Spec[];
  colors?: ProductColor[];
  storageOptions?: StorageOption[];
  /** Admin-controlled homepage placement. At most one product should be the hero. */
  isHero?: boolean;
  isHotDeal?: boolean;
  isFeatured?: boolean;
}

export interface CategoryBrand {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  count: number;
  brands?: CategoryBrand[];
}

export interface BrandLogo {
  name: string;
  logo: string;
}
