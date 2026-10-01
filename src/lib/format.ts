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
  address:
    "Shop No. 110, Mezzanine Floor, Emerald Tower, 2 Talwar, Block-5, Clifton, Karachi, Pakistan",
  phonePrimary: "+92 314 3262666",
  phonePrimaryHref: "tel:+923143262666",
  phoneSecondary: "+92 305 6661301",
  phoneSecondaryHref: "tel:+923056661301",
  emailSales: "sale@mobilenbazaar.com",
  emailInfo: "mobilenbazaar@gmail.com",
  whatsappNumber: "923143262666",
} as const;
