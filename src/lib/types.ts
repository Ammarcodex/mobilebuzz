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

/** A selectable storage/GB button. `price` is the full price for that storage tier. */
export interface StorageOption {
  label: string;
  price: number;
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
