"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { BUSINESS } from "@/lib/format";
import {
  INSTALLMENT_PLANS,
  calculateInstallment,
  type InstallmentMonths,
} from "@/lib/installment";

type PaymentMethod = "cod" | "installment";

interface FormState {
  name: string;
  phone: string;
  address: string;
  city: string;
  notes: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  phone: "",
  address: "",
  city: "",
  notes: "",
};

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [months, setMonths] = useState<InstallmentMonths>(6);
  const [downPayment, setDownPayment] = useState<number>(0);
  const [summary, setSummary] = useState<string | null>(null);

  const breakdown = useMemo(
    () => calculateInstallment(subtotal, months, downPayment),
    [subtotal, months, downPayment]
  );

  function buildSummary(): string {
    const lines: string[] = [];
    lines.push("New Order — Mobile Buzz");
    lines.push("");
    lines.push("Items:");
    for (const item of items) {
      lines.push(
        `- ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""} x${item.quantity} — ${formatPrice(
          item.price * item.quantity
        )}`
      );
    }
    lines.push("");
    lines.push(`Subtotal: ${formatPrice(subtotal)}`);

    if (paymentMethod === "installment") {
      lines.push(`Payment: Installment Plan (${months} months)`);
      lines.push(`Total Payable (incl. markup): ${formatPrice(breakdown.totalPayable)}`);
      lines.push(`Down Payment: ${formatPrice(breakdown.downPayment)}`);
      lines.push(
        `Monthly Installment: ${formatPrice(breakdown.monthlyInstallment)} × ${months}mo`
      );
    } else {
      lines.push("Payment: Cash on Delivery");
    }

    lines.push("");
    lines.push("Customer Details:");
    lines.push(`Name: ${form.name}`);
    lines.push(`Phone: ${form.phone}`);
    lines.push(`Address: ${form.address}`);
    lines.push(`City: ${form.city}`);
    if (form.notes) lines.push(`Notes: ${form.notes}`);
    return lines.join("\n");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = buildSummary();
    setSummary(text);
    const url = `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  if (items.length === 0 && !summary) {
    return (
      <div className="mx-auto max-w-[700px] px-6 py-20 text-center">
        <h1 className="m-0 mb-3 text-3xl font-extrabold text-ink">
          Your Cart is Empty
        </h1>
        <p className="mb-6 text-muted">
          Add a product to your cart before checking out.
        </p>
        <Link
          href="/shop"
          className="pill-solid inline-block rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 pb-16 pt-10">
      <h1 className="m-0 mb-2 text-3xl font-extrabold tracking-tight text-ink">
        Checkout
      </h1>
      <p className="mb-8 text-[15px] text-muted">
        Pay cash on delivery or spread the cost over easy monthly
        installments — no payment gateway, no card details needed.
        We&apos;ll confirm your order over WhatsApp.
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="glass flex flex-col gap-4 rounded-3xl p-6 sm:p-8">
          <Field label="Full Name">
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Phone Number">
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input"
              placeholder="03XX XXXXXXX"
            />
          </Field>
          <Field label="Delivery Address">
            <textarea
              required
              rows={3}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="input resize-none"
            />
          </Field>
          <Field label="City">
            <input
              required
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Order Notes (optional)">
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="input resize-none"
            />
          </Field>

          <div>
            <span className="mb-2 block text-sm font-semibold text-ink">
              Payment Method
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`pill-glass glass rounded-full px-5 py-2.5 text-sm font-semibold ${
                  paymentMethod === "cod" ? "ring-2 ring-accent" : ""
                }`}
              >
                Cash on Delivery
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod("installment")}
                className={`pill-glass glass rounded-full px-5 py-2.5 text-sm font-semibold ${
                  paymentMethod === "installment" ? "ring-2 ring-accent" : ""
                }`}
              >
                Installment Plan
              </button>
            </div>
          </div>

          {paymentMethod === "cod" ? (
            <div className="rounded-2xl subtle-surface p-4 text-sm text-muted">
              Pay <strong className="text-ink">{formatPrice(subtotal)}</strong>{" "}
              in cash when your order arrives — no card details needed.
            </div>
          ) : (
            <div className="flex flex-col gap-4 rounded-2xl subtle-surface p-4">
              <div>
                <span className="mb-2 block text-sm font-semibold text-ink">
                  Plan Length
                </span>
                <div className="flex flex-wrap gap-2">
                  {INSTALLMENT_PLANS.map((plan) => (
                    <button
                      key={plan.months}
                      type="button"
                      onClick={() => setMonths(plan.months)}
                      className={`pill-solid rounded-full px-4 py-2 text-sm font-bold transition-colors ${
                        months === plan.months
                          ? "bg-accent text-white"
                          : "bg-white/60 text-ink dark:bg-white/10"
                      }`}
                    >
                      {plan.months}mo
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold text-ink">
                  Down Payment (₨)
                </span>
                <input
                  type="number"
                  min={0}
                  value={downPayment || ""}
                  onChange={(e) => setDownPayment(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="input"
                />
              </label>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="glass rounded-2xl p-3">
                  <dt className="text-xs text-muted">Total Payable</dt>
                  <dd className="m-0 font-bold text-ink">
                    {formatPrice(breakdown.totalPayable)}
                  </dd>
                </div>
                <div className="glass rounded-2xl p-3">
                  <dt className="text-xs text-muted">Down Payment</dt>
                  <dd className="m-0 font-bold text-ink">
                    {formatPrice(breakdown.downPayment)}
                  </dd>
                </div>
                <div className="glass col-span-2 rounded-2xl p-3 ring-1 ring-accent/30">
                  <dt className="text-xs text-muted">Monthly Installment</dt>
                  <dd className="m-0 font-extrabold text-accent">
                    {formatPrice(breakdown.monthlyInstallment)}
                    <span className="ml-1 text-xs font-medium text-muted">
                      × {months}mo
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <button
            type="submit"
            className="pill-solid mt-2 rounded-full bg-accent px-8 py-3.5 text-sm font-bold text-white shadow-[0_10px_24px_rgba(0,113,227,0.35)]"
          >
            Place Order via WhatsApp
          </button>
        </form>

        <div className="glass h-fit rounded-3xl p-6 sm:p-8">
          <h2 className="m-0 mb-4 text-lg font-bold text-ink">Order Summary</h2>
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between text-sm">
                <span className="text-ink">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-semibold text-ink">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-black/10 dark:border-white/10 pt-4 text-base font-extrabold text-ink">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          {paymentMethod === "installment" ? (
            <div className="mt-4 flex flex-col gap-2 border-t border-black/10 dark:border-white/10 pt-4 text-sm">
              <div className="flex justify-between text-muted">
                <span>Installment markup ({months}mo)</span>
                <span>+{formatPrice(breakdown.totalPayable - subtotal)}</span>
              </div>
              <div className="flex justify-between font-bold text-ink">
                <span>Total Payable</span>
                <span>{formatPrice(breakdown.totalPayable)}</span>
              </div>
              <div className="flex justify-between text-muted">
                <span>Due Today (Down Payment)</span>
                <span>{formatPrice(breakdown.downPayment)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-accent">
                <span>Monthly Installment</span>
                <span>
                  {formatPrice(breakdown.monthlyInstallment)} × {months}mo
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {summary ? (
        <div className="glass mt-8 rounded-3xl p-6 sm:p-8">
          <h2 className="m-0 mb-3 text-lg font-bold text-ink">
            Order Sent — Confirmation
          </h2>
          <p className="mb-4 text-sm text-muted">
            We opened WhatsApp with your order details below pre-filled.
            Please hit send there to confirm your order with us.
          </p>
          <pre className="whitespace-pre-wrap rounded-2xl subtle-surface p-4 text-sm text-ink">
            {summary}
          </pre>
          <button
            type="button"
            onClick={() => {
              clearCart();
              setForm(EMPTY_FORM);
            }}
            className="pill-solid mt-4 rounded-full bg-accent px-6 py-3 text-sm font-bold text-white"
          >
            Clear Cart
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
      </span>
      {children}
    </label>
  );
}
