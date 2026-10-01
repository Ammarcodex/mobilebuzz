import type { Metadata } from "next";
import { BUSINESS } from "@/lib/format";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default function ContactUsPage() {
  const mapsSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    BUSINESS.address
  )}&output=embed`;

  return (
    <div className="mx-auto max-w-[1100px] px-6 pb-16 pt-10">
      <h1 className="m-0 mb-8 text-[32px] font-extrabold tracking-tight text-ink">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="glass rounded-3xl p-6 sm:p-8">
            <h2 className="m-0 mb-4 text-lg font-bold text-ink">
              Get In Touch
            </h2>
            <div className="flex flex-col gap-3 text-sm text-ink">
              <div>
                <span className="font-semibold">Address: </span>
                {BUSINESS.address}
              </div>
              <div>
                <span className="font-semibold">Phone: </span>
                <a href={BUSINESS.phonePrimaryHref} className="hover:text-accent">
                  {BUSINESS.phonePrimary}
                </a>
                {" · "}
                <a href={BUSINESS.phoneSecondaryHref} className="hover:text-accent">
                  {BUSINESS.phoneSecondary}
                </a>
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                <a href={`mailto:${BUSINESS.emailSales}`} className="hover:text-accent">
                  {BUSINESS.emailSales}
                </a>
                {" · "}
                <a href={`mailto:${BUSINESS.emailInfo}`} className="hover:text-accent">
                  {BUSINESS.emailInfo}
                </a>
              </div>
            </div>
          </div>

          <div className="glass overflow-hidden rounded-3xl">
            <iframe
              title="Mobile Buzz location"
              src={mapsSrc}
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
