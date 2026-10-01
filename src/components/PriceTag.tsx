import { formatPrice } from "@/lib/format";

export default function PriceTag({
  price,
  className,
}: {
  price: number;
  className?: string;
}) {
  const contactForPrice = !price || price <= 0;
  return (
    <span
      className={`font-extrabold text-ink ${
        contactForPrice ? "text-[15px]" : "text-[17px]"
      } ${className ?? ""}`}
    >
      {formatPrice(price)}
    </span>
  );
}
