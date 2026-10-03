import type { Metadata } from "next";
import { BUSINESS } from "@/lib/format";

export const metadata: Metadata = { title: "About Us" };

export default function AboutUsPage() {
  return (
    <div className="mx-auto max-w-[800px] px-6 pb-16 pt-10">
      <h1 className="m-0 mb-6 text-[32px] font-extrabold tracking-tight text-ink">
        About Mobile Buzz
      </h1>
      <div className="glass rounded-3xl p-8 sm:p-10">
        <p className="mb-5 text-[17px] leading-[1.7] text-ink">
          We are the dealers of Dell, HP, Apple, Oppo, Vivo, Honor, Samsung,
          Huawei &amp; Nokia. We believe in not just better, but the best of
          what we can provide.
        </p>
        <p className="mb-5 text-[15px] leading-[1.7] text-muted">
          Mobile Buzz is a Karachi-based retailer of genuine smartphones and
          smartwatches, offering cash-on-delivery across the city and easy
          monthly installment plans up to 12 months — no bank card required.
          Every product we sell is 100% genuine, sourced directly from
          authorized brand channels.
        </p>
        <div className="grid grid-cols-1 gap-6 border-t border-black/10 dark:border-white/10 pt-6 sm:grid-cols-2">
          <div>
            <h2 className="m-0 mb-2 text-sm font-bold uppercase tracking-wide text-subtle">
              Call Us
            </h2>
            <p className="m-0 text-sm text-ink">
              <a href={BUSINESS.phonePrimaryHref} className="hover:text-accent">
                {BUSINESS.phonePrimary}
              </a>
            </p>
          </div>
          <div>
            <h2 className="m-0 mb-2 text-sm font-bold uppercase tracking-wide text-subtle">
              Email Us
            </h2>
            <p className="m-0 text-sm text-ink">
              <a href={`mailto:${BUSINESS.emailSales}`} className="hover:text-accent">
                {BUSINESS.emailSales}
              </a>
            </p>
          </div>
          <div>
            <h2 className="m-0 mb-2 text-sm font-bold uppercase tracking-wide text-subtle">
              Payment
            </h2>
            <p className="m-0 text-sm text-ink">
              Cash on Delivery only — no online payment gateway.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
