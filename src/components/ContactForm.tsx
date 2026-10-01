"use client";

import { useState } from "react";
import { BUSINESS } from "@/lib/format";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = `Hello Mobile Buzz,\n\nName: ${name}\nEmail: ${email}\n\n${message}`;
    const whatsappUrl = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Your Name
        </span>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Your Email
        </span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold text-ink">
          Message
        </span>
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input resize-none"
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="pill-solid rounded-full bg-accent px-7 py-3 text-sm font-bold text-white"
        >
          Send via WhatsApp
        </button>
        <a
          href={`mailto:${BUSINESS.emailSales}?subject=${encodeURIComponent(
            "Website Inquiry"
          )}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\n${message}`
          )}`}
          className="pill-glass glass rounded-full px-7 py-3 text-sm font-bold text-ink"
        >
          Send via Email
        </a>
      </div>
      {sent ? (
        <p className="text-sm font-semibold text-accent">
          We opened WhatsApp with your message pre-filled — hit send there to
          reach us.
        </p>
      ) : null}
    </form>
  );
}
