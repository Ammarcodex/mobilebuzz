import Image from "next/image";

export default function Logo({ size = "md" }: { size?: "md" | "lg" }) {
  const iconHeight = size === "lg" ? 52 : 46;
  const nameSize = size === "lg" ? "text-[19px]" : "text-[17px]";
  const tagSize = size === "lg" ? "text-[11px]" : "text-[10px]";

  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo-icon.png"
        alt=""
        width={iconHeight}
        height={iconHeight}
        style={{ height: iconHeight, width: "auto" }}
        priority
      />
      <span className="flex flex-col leading-[1.08]">
        <span
          className={`${nameSize} font-extrabold tracking-tight text-ink`}
        >
          MOBILE BUZZ
        </span>
        <span
          className={`${tagSize} font-bold tracking-[0.09em] text-[#e42131]`}
        >
          FEEL FREE TO BUY
        </span>
      </span>
    </span>
  );
}
