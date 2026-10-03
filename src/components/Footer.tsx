import Link from "next/link";
import Logo from "./Logo";
import { BUSINESS } from "@/lib/format";

const QUICK_LINKS = [
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/installment-procedure", label: "Installment Procedure" },
  { href: "/shop", label: "Shop" },
];

const CARE_LINKS = [
  { href: "/wishlist", label: "Wishlist" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/contact-us", label: "FAQs" },
];

function SocialIcon({
  children,
  label,
  href = "#",
}: {
  children: React.ReactNode;
  label: string;
  href?: string;
}) {
  const external = href !== "#";
  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="icon-btn flex h-[34px] w-[34px] items-center justify-center rounded-full subtle-surface text-[#3a3a3d] dark:text-[#e5e5ea]"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="mx-auto mt-16 max-w-[1440px] px-6 pb-6">
      <div className="glass rounded-[32px] p-8 sm:p-11">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Link href="/" className="mb-4 inline-flex">
              <Logo size="lg" />
            </Link>
            <p className="mb-4 max-w-[280px] text-[13px] leading-[1.7] text-muted">
              We are the dealers of Dell, HP, Apple, Oppo, Vivo, Honor,
              Samsung, Huawei &amp; Nokia. We believe in not just better, but
              the best of what we can provide.
            </p>
            <div className="flex gap-2.5">
              <SocialIcon label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 9H15V6.5h-1.75C11.02 6.5 10 7.6 10 9.75V11H8.5v2.5H10V21h2.5v-7.5H14l.5-2.5h-2V9.9c0-.6.2-.9.9-.9z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Instagram">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Twitter">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.9 3H21l-6.6 7.5L22 21h-6.3l-4.9-6.4L5.2 21H3l7-8-7-10h6.4l4.4 5.9L18.9 3z" />
                </svg>
              </SocialIcon>
              <SocialIcon
                label="WhatsApp"
                href={`https://wa.me/${BUSINESS.whatsappNumber}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.1a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20.1z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">Quick Links</h4>
            <div className="flex flex-col gap-[11px] text-[13px]">
              {QUICK_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="foot-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">Customer Care</h4>
            <div className="flex flex-col gap-[11px] text-[13px]">
              {CARE_LINKS.map((l) => (
                <Link key={l.label} href={l.href} className="foot-link">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-bold text-ink">Get In Touch</h4>
            <div className="flex flex-col gap-[13px] text-[13px] leading-[1.6] text-muted">
              <a
                href={BUSINESS.phonePrimaryHref}
                className="foot-link flex items-center gap-2.5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {BUSINESS.phonePrimary}
              </a>
              <a
                href={`mailto:${BUSINESS.emailSales}`}
                className="foot-link flex items-center gap-2.5"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                {BUSINESS.emailSales}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-black/10 dark:border-white/10 pt-5 text-center text-xs text-subtle">
          © {new Date().getFullYear()} Mobile Buzz. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
