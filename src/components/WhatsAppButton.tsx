"use client";

import { useEffect, useRef, useState } from "react";
import { BUSINESS } from "@/lib/format";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes! Cash on Delivery is available across Karachi — you can also pay online or via bank transfer if you prefer.",
  },
  {
    q: "Can I buy on installments?",
    a: "Yes — easy monthly installments for 3, 6, 9 or 12 months, with a minimum 30% down payment. Check our Installment Procedure page for the full breakdown.",
  },
  {
    q: "What's the difference between PTA and Non-PTA?",
    a: "PTA Approved phones are registered with the PTA and work on all local networks with full signal. Non-PTA phones are cheaper but may lose cellular service unless registered separately.",
  },
  {
    q: "Are your phones genuine?",
    a: "100% genuine — we're authorized dealers for Samsung, Apple, Oppo, Vivo, Infinix, Xiaomi, Tecno, Realme and more.",
  },
  {
    q: "Where are you located?",
    a: "We're based in Karachi. Tap “Chat on WhatsApp” below for exact directions and store hours.",
  },
];

const WELCOME_MESSAGE =
  "Hi there! 👋 I'm the Mobile Buzz assistant. Pick a question below, or chat with our team directly on WhatsApp.";

const WHATSAPP_HREF = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(
  "Hi! I'm interested in your phones."
)}`;

function WhatsAppIcon({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.1a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20.1z" />
      <path d="M16.3 13.5c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5.1-.1.2-.3.4-.4.1-.1.2-.2.2-.4.1-.1 0-.3 0-.4 0-.1-.5-1.3-.7-1.7-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.6.2 1 .4 1.3.5.6.2 1.1.2 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { role: "bot" | "user"; text: string }[]
  >([{ role: "bot", text: WELCOME_MESSAGE }]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  function askQuestion(item: FaqItem) {
    setMessages((prev) => [
      ...prev,
      { role: "user", text: item.q },
      { role: "bot", text: item.a },
    ]);
  }

  // Keep the newest message in view — the pane is short enough that a
  // couple of answers can otherwise scroll the latest one out of sight.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <>
      {open ? (
        <div
          role="dialog"
          aria-label="Mobile Buzz chat"
          className="chat-panel-in glass fixed bottom-24 right-5 z-50 flex max-h-[min(540px,calc(100vh-7rem))] w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-[28px] sm:bottom-28 sm:right-7"
        >
          <div className="flex items-center justify-between gap-3 bg-[#25D366] px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
                <WhatsAppIcon size={18} />
              </span>
              <div>
                <div className="text-sm font-bold">Mobile Buzz</div>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#baf7c8]" />
                  Typically replies instantly
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/90 transition-colors hover:bg-white/15"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-snug ${
                  m.role === "bot"
                    ? "subtle-surface self-start text-ink"
                    : "self-end bg-accent text-white"
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex flex-wrap gap-2 border-t border-black/10 px-4 py-3 dark:border-white/10">
            {FAQS.map((item) => (
              <button
                key={item.q}
                type="button"
                onClick={() => askQuestion(item)}
                className="pill-glass glass rounded-full px-3 py-1.5 text-left text-xs font-semibold text-ink"
              >
                {item.q}
              </button>
            ))}
          </div>

          <a
            href={WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[#20bd5a]"
          >
            <WhatsAppIcon size={18} />
            Chat on WhatsApp
          </a>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat with us"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.45)] transition-transform hover:scale-105 sm:bottom-7 sm:right-7"
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <WhatsAppIcon />
        )}
      </button>
    </>
  );
}
