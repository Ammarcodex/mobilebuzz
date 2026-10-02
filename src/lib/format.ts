import type { Product } from "./types";

export function formatPrice(price: number | null | undefined): string {
  if (!price || price <= 0) return "Contact for Price";
  return `₨${Math.round(price).toLocaleString("en-US")}`;
}

/** The price to show outside the product page's variant picker: the cheapest
 * storage option when the product has any, otherwise the base price. */
export function getDisplayPrice(
  product: Pick<Product, "price" | "storageOptions">
): number {
  if (product.storageOptions && product.storageOptions.length > 0) {
    return Math.min(...product.storageOptions.map((o) => o.price));
  }
  return product.price;
}

export const BUSINESS = {
  name: "Mobile Buzz",
  tagline: "Feel Free to Buy",
  phonePrimary: "+92 311 2269771",
  phonePrimaryHref: "tel:+923112269771",
  emailSales: "Mobilebuzz00@gmail.com",
  emailInfo: "mobilenbazaar@gmail.com",
  whatsappNumber: "923112269771",
} as const;
