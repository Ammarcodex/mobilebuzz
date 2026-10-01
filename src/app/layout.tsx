import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AmbientBlobs from "@/components/AmbientBlobs";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Mobile Buzz — Feel Free to Buy",
    template: "%s — Mobile Buzz",
  },
  description:
    "Genuine smartphones and smartwatches in Karachi, Pakistan. Cash on delivery, plus easy monthly installments up to 12 months.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <body className="relative min-h-screen overflow-x-hidden bg-bg font-sans text-ink antialiased">
        <AmbientBlobs />
        <CartProvider>
          <WishlistProvider>
            <div className="relative z-10 flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
